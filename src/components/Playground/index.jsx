import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { number } from 'prop-types';
import classnames from 'classnames';

import { setCurrentScreen } from 'redux/ui/actions';
import {
  setUserMoves,
  setSwaps,
  setRotates,
  setAmmo,
  resetAmmo,
} from 'redux/user/actions';
import { setStash } from 'redux/userStash/actions';

import mapSet, { Map } from 'maps/maps';

import {
  BaseUnit,
  Bobomb,
  Laser,
  generatePortals,
  generateTeleports,
  Deflector,
  Wall,
} from 'units';

import { readMaps } from 'api/api';
import {
  ITEM_MULTISELECT_MODE,
  CELL_MULTISELECT_MODE,
  GAMEPLAY_MODE,
  SELECT_MODE,
  PLACING_MODE,
  SCREEN_MODES,
} from 'constants/constants';

import Projectile from '../Projectile';
import Unit from '../Unit';
import UserMenu from '../UserMenu';

import './Playground.scss';

const MAX_MULTISELECT = 2;

function Playground({ projectileExplosionDuration, projectileMoveStep }) {
  const dispatch = useDispatch();

  const { user, userStash } = useSelector((state) => state);

  const {
    userMoves,
    bobombs,
    defaults,
    lasers,
    portals,
    swaps,
    rotates,
    jumps,
  } = user;

  const [userInputMode, setUserInputMode] = useState(GAMEPLAY_MODE);
  const [afterInputAction, setAfterInputAction] = useState(null);

  const [currentLevel, setCurrentLevel] = useState(0);
  const [levelCounter, setLevelCounter] = useState(0);

  const [map, setMap] = useState([]);
  const [fieldInfo, setFieldInfo] = useState({});

  const [grid, setGrid] = useState([]);

  const [units, setUnits] = useState([]);
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);

  const [unitsMap, setUnitsMap] = useState([]);

  const [projectiles, setProjectiles] = useState([]);

  const [winScreenVisible, setWinScreenVisible] = useState(false);
  const [loseScreenVisible, setLoseScreenVisible] = useState(false);

  const generateUnitsMap = (fieldTop, fieldLeft) => [...document.querySelectorAll('.unit')].map((unit) => {
    const { dataset } = unit;
    const { index } = dataset;

    const { top, left } = unit.querySelector('.unit-pivot').getBoundingClientRect();

    const turretsData = [];

    const {
      turrets, angle: unitAngle, value, type, meta, explosionStart, hitBoxRadius,
    } = units[index] || {};

    unit.querySelectorAll('.turret').forEach((turret) => {
      const gunpoint = turret.querySelector('.gunpoint');
      const { name: turretName } = turret.dataset;
      const { top: gunpointTop, left: gunpointLeft } = gunpoint.getBoundingClientRect();

      const {
        angle,
        type: turretType,
        maxDistance,
        speed,
      } = turrets.find(({ name }) => (name === turretName));

      turretsData.push({
        turretName,
        gunpointTop: gunpointTop - fieldTop,
        gunpointLeft: gunpointLeft - fieldLeft,
        angle: unitAngle + angle,
        type: turretType,
        maxDistance,
        speed,
      });
    });

    return {
      id: unit.id,
      hitBoxRadius,
      type,
      index: parseInt(index, 10),
      value,
      top: top - fieldTop,
      left: left - fieldLeft,
      turrets: turretsData,
      angle: unitAngle,
      meta,
      explosionStart,
    };
  });

  const dischargeAllTurrets = (unitIndex, theUnitsMap) => {
    const { id: unitOfOriginId, turrets } = theUnitsMap[unitIndex] || {};

    if (!unitOfOriginId) {
      return;
    }

    const moveStep = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--base-width-unit'));

    turrets.forEach((turret) => {
      const {
        gunpointTop: top, gunpointLeft: left, angle, type, maxDistance, speed,
      } = turret;

      const id = Math.random().toString(16).substring(2);

      projectiles.push({
        unitOfOriginId,
        id,
        top,
        left,
        angle,
        type,
        maxDistance,
        speed,
        moveStep,
      });
    });

    Playground.actingProjectilesNumber += turrets.length;

    setProjectiles(projectiles);
  };

  const explodeUnit = (unitIndex) => {
    const newUnits = [...units];

    newUnits[unitIndex].exploding = true;

    newUnits[unitIndex].explosionStart = +Date.now();
    newUnits[unitIndex].value = newUnits[unitIndex].minValue;

    setUnits(newUnits);
  };

  const setUnitValue = (unitIndex, newValue, onValueExceed) => {
    const newUnits = [...units];
    const { maxValue, minValue } = newUnits[unitIndex];

    if (newValue > maxValue) {
      onValueExceed();
      newUnits[unitIndex].value = minValue;
    } else {
      newUnits[unitIndex].value = newValue;
      newUnits[unitIndex].exploding = false;
    }

    setUnits(newUnits);
  };

  const detectUserMoveOutcome = (currentUserMoves) => {
    if (Playground.actingProjectilesNumber === 0 && currentUserMoves <= 0) {
      setLoseScreenVisible(true);
    }
  };

  const setNewMovesCount = (altKey, shiftKey) => {
    if (!shiftKey && !altKey) {
      dispatch(setUserMoves(userMoves - 1));
    }

    return userMoves - 1;
  };

  const performSwap = () => {
    const newUnits = [...units];

    const { unitIndex: unit0Index } = selectedUnits[0];
    const { unitIndex: unit1Index } = selectedUnits[1];

    const { top: top0, left: left0 } = newUnits[unit0Index];

    newUnits[unit0Index].top = newUnits[unit1Index].top;
    newUnits[unit0Index].left = newUnits[unit1Index].left;

    newUnits[unit1Index].top = top0;
    newUnits[unit1Index].left = left0;

    setUnits(newUnits);

    dispatch(setSwaps(swaps - 1));
  };

  const placePortals = () => {
    const newUnits = [...units];

    const { top: top0, left: left0 } = selectedCells[0];
    const { top: top1, left: left1 } = selectedCells[1];

    const [portal1, portal2] = generatePortals(top0, left0, top1, left1);

    newUnits.push(portal1);
    newUnits.push(portal2);

    setUnits(newUnits);

    dispatch(setAmmo({ portals: portals - 1 }));
  };

  const placeTeleports = () => {
    const newUnits = [...units];

    const { top: top0, left: left0 } = selectedCells[0];
    const { top: top1, left: left1 } = selectedCells[1];

    const [teleport1, teleport2] = generateTeleports(top0, left0, top1, left1);

    newUnits.push(teleport1);
    newUnits.push(teleport2);

    setUnits(newUnits);
  };

  const performRotate = (unitIndex, angle = 45) => {
    const newUnits = [...units];

    const directionMultiplier = afterInputAction === 'rotate_ccv' ? -1 : 1;

    newUnits[unitIndex].angle += (angle * directionMultiplier);
    setUnits(newUnits);

    dispatch(setRotates(rotates - 1));
  };

  const performJump = (unitIndex, top, left) => {
    units[unitIndex].top = top;
    units[unitIndex].left = left;

    setUnits([...units]);

    dispatch(setAmmo({ jumps: jumps - 1 }));
  };

  const makePlayerMove = (e, unitId, unitIndex) => {
    setProjectiles([]);

    const {
      top: fieldTop, left: fieldLeft, width: fieldWidth, height: fieldHeight,
    } = document.querySelector('#field').getBoundingClientRect();

    const newFieldInfo = {
      fieldTop, fieldLeft, fieldWidth, fieldHeight,
    };

    const newUnitsMap = generateUnitsMap(fieldTop, fieldLeft);

    setFieldInfo(newFieldInfo);
    setUnitsMap(newUnitsMap);

    const { altKey, shiftKey } = e;

    let newValue = units[unitIndex].value + 1;

    if (altKey) {
      newValue = 0;
    }

    if (shiftKey) {
      newValue = units[unitIndex].maxValue;
    }

    const callbacks = {
      default: () => {
        setUnitValue(unitIndex, newValue, () => {
          dischargeAllTurrets(unitIndex, newUnitsMap);
          explodeUnit(unitIndex);
        });

        const newMoves = setNewMovesCount(altKey, shiftKey);
        detectUserMoveOutcome(newMoves);
      },
      wall: () => {},
      portal: () => {},
      hidden: () => {
        setUnitValue(unitIndex, newValue, () => {
          dischargeAllTurrets(unitIndex, newUnitsMap);
          explodeUnit(unitIndex);
        });

        const newMoves = setNewMovesCount(altKey, shiftKey);
        detectUserMoveOutcome(newMoves);
      },
      laser: () => {
        setUnitValue(unitIndex, newValue, () => {
          dischargeAllTurrets(unitIndex, newUnitsMap);
          explodeUnit(unitIndex);
        });

        const newMoves = setNewMovesCount(altKey, shiftKey);
        detectUserMoveOutcome(newMoves);
      },
      bobomb: () => {
        setUnitValue(unitIndex, newValue, () => {
          dischargeAllTurrets(unitIndex, newUnitsMap);
          explodeUnit(unitIndex);
        });

        const newMoves = setNewMovesCount(altKey, shiftKey);
        detectUserMoveOutcome(newMoves);
      },
    };

    if (callbacks[units[unitIndex].type]) {
      callbacks[units[unitIndex].type]();
    }
  };

  const removeUnit = (index) => {
    units.splice(parseInt(index, 10), 1);
    setUnits([...units]);
  };

  const placeUnit = (newUnitTop, newUnitLeft) => {
    const generators = {
      default: (unitTop, unitLeft, params) => new BaseUnit(unitTop, unitLeft, params),
      bobomb: (unitTop, unitLeft, params) => new Bobomb(unitTop, unitLeft, params),
      laser: (unitTop, unitLeft, params) => new Laser(unitTop, unitLeft, params),
      deflector: (unitTop, unitLeft, params) => new Deflector(unitTop, unitLeft, params),
      wall: (unitTop, unitLeft, params) => new Wall(unitTop, unitLeft, params),
    };

    const callbacks = {
      default: () => dispatch(setAmmo({ defaults: defaults - 1 })),
      bobomb: () => dispatch(setAmmo({ bobombs: bobombs - 1 })),
      laser: () => dispatch(setAmmo({ lasers: lasers - 1 })),
      deflector: () => {},
      wall: () => {},
    };

    const newUnit = generators[afterInputAction](newUnitTop, newUnitLeft, { value: 4 });

    const newUnits = [...units];

    newUnits.push(newUnit);

    setUnits(newUnits);

    callbacks[afterInputAction]();
  };

  const handleUnitClick = (e, unitId, unitIndex) => {
    if (Playground.actingProjectilesNumber > 0) {
      return;
    }

    if (!units[unitIndex].selectable) {
      return;
    }

    if (userInputMode === GAMEPLAY_MODE) {
      makePlayerMove(e, unitId, unitIndex);
    }

    if (userInputMode === SELECT_MODE) {
      setSelectedUnits([{ unitId, unitIndex }]);

      if (afterInputAction === 'jump' && selectedCells.length > 0) {
        const { top, left } = selectedCells[0];
        performJump(unitIndex, top, left);

        setUserInputMode(GAMEPLAY_MODE);
        setSelectedCells([]);
        setSelectedUnits([]);
        setAfterInputAction(null);
      }

      if (afterInputAction === 'delete') {
        removeUnit(unitIndex);
        setUserInputMode(GAMEPLAY_MODE);
        setSelectedCells([]);
        setSelectedUnits([]);
        setAfterInputAction(null);
      }

      if (afterInputAction === 'rotate_ccv' || afterInputAction === 'rotate_cv') {
        performRotate(unitIndex);

        setUserInputMode(GAMEPLAY_MODE);
        setSelectedUnits([]);
        setAfterInputAction(null);
      }
    }

    if (userInputMode === ITEM_MULTISELECT_MODE) {
      selectedUnits.push({ unitId, unitIndex });
      setSelectedUnits([...selectedUnits]);

      if (selectedUnits.length >= MAX_MULTISELECT) {
        if (afterInputAction === 'swap') {
          performSwap();

          setUserInputMode(GAMEPLAY_MODE);
          setSelectedUnits([]);
        }

        setAfterInputAction(null);
      }

      const { fieldTop, fieldLeft } = fieldInfo;
      const newUnitsMap = generateUnitsMap(fieldTop, fieldLeft);
      setUnitsMap(newUnitsMap);
    }
  };

  const handleMapCellClick = (id, top, left) => {
    if (userInputMode === PLACING_MODE) {
      placeUnit(top, left);
      setUserInputMode(GAMEPLAY_MODE);
      setAfterInputAction(null);
    }

    if (userInputMode === SELECT_MODE) {
      setSelectedCells([{ id, top, left }]);

      if (afterInputAction === 'jump' && selectedUnits.length > 0) {
        const { unitIndex } = selectedUnits[0];
        performJump(unitIndex, top, left);

        setUserInputMode(GAMEPLAY_MODE);
        setSelectedCells([]);
        setSelectedUnits([]);
        setAfterInputAction(null);
      }
    }

    if (userInputMode === CELL_MULTISELECT_MODE) {
      selectedCells.push({ id, top, left });
      setSelectedCells([...selectedCells]);

      if (selectedCells.length >= MAX_MULTISELECT) {
        if (afterInputAction === 'portal') {
          placePortals();

          setUserInputMode(GAMEPLAY_MODE);

          setSelectedCells([]);
        }

        if (afterInputAction === 'teleport') {
          placeTeleports();

          setUserInputMode(GAMEPLAY_MODE);
          setSelectedCells([]);
        }

        setAfterInputAction(null);
      }
    }
  };

  const applyLevelPenalty = (level) => {
    const reward = {};

    if (!level.penalty) {
      return;
    }

    Object.keys(level.penalty).forEach((key) => {
      reward[key] = user[key] - level.penalty[key];
    });

    dispatch(setAmmo(reward));
  };

  const applyLevelReward = (level) => {
    const reward = {};

    if (!level.reward) {
      return;
    }

    Object.keys(level.reward).forEach((key) => {
      reward[key] = user[key] + level.reward[key];
    });

    dispatch(setAmmo(reward));
  };

  const detectGameOutcome = () => {
    if (Playground.actingProjectilesNumber !== 0) {
      return;
    }

    const someUnitsLeft = units.some((unit) => unit.valueCountable && unit.value > 0);

    if (userMoves < 1 && someUnitsLeft) {
      setLoseScreenVisible(true);
      return;
    }

    if (userMoves >= 0 && !someUnitsLeft) {
      setTimeout(() => {
        setWinScreenVisible(true);

        applyLevelReward(map);
        applyLevelPenalty(map);
      }, projectileExplosionDuration + 300);
    }
  };

  const onOutOfFiled = () => {
    Playground.actingProjectilesNumber -= 1;

    detectGameOutcome();
  };

  const combosRewards = [
    () => {
      console.log('FIRST COMBO !!!');
    },
    () => {
      console.log('SECOND COMBO !!!');
    },
    () => {
      console.log('THIRD COMBO !!!');
    },
  ];

  const executeCombo = () => {
    Playground.comboCounter += 1;

    if (Playground.comboCounter === map.comboSequence[Playground.comboCursor]) {
      if (combosRewards[Playground.comboCursor]) {
        combosRewards[Playground.comboCursor]();
      }

      Playground.comboCounter = 0;
      Playground.comboCursor += 1;
    }
  };

  const onModeChange = (mode, data) => {
    setAfterInputAction(data.callback);
    setUserInputMode(mode);
  };

  const onImpact = (projectileType, impactedUnitIndex, impactWithExplodingUnit) => {
    const { maxValue } = units[impactedUnitIndex];

    const callbacks = {
      default: () => {
        if (projectileType === 'default') {
          Playground.actingProjectilesNumber -= 1;

          if (impactWithExplodingUnit) {
            return;
          }

          setUnitValue(impactedUnitIndex, units[impactedUnitIndex].value + 1, () => {
            dischargeAllTurrets(impactedUnitIndex, unitsMap);
            explodeUnit(impactedUnitIndex);
            executeCombo();
          });
        }

        if (projectileType === 'laser') {
          setUnitValue(impactedUnitIndex, maxValue + 1, () => {
            dischargeAllTurrets(impactedUnitIndex, unitsMap);
            explodeUnit(impactedUnitIndex);
            executeCombo();
          });
        }

        if (projectileType === 'bobomb') {
          Playground.actingProjectilesNumber -= 1;

          if (impactWithExplodingUnit) {
            return;
          }

          setUnitValue(impactedUnitIndex, maxValue + 1, () => {
            dischargeAllTurrets(impactedUnitIndex, unitsMap);
            explodeUnit(impactedUnitIndex);
            executeCombo();
          });
        }
      },
      wall: () => {
        Playground.actingProjectilesNumber -= 1;
      },
      laser: () => {
        Playground.actingProjectilesNumber -= 1;

        if (impactWithExplodingUnit) {
          return;
        }

        setUnitValue(impactedUnitIndex, units[impactedUnitIndex].value + 1, () => {
          dischargeAllTurrets(impactedUnitIndex, unitsMap);
          explodeUnit(impactedUnitIndex);
          executeCombo();
        });
      },
      bobomb: () => {
        Playground.actingProjectilesNumber -= 1;

        if (impactWithExplodingUnit) {
          return;
        }

        setUnitValue(impactedUnitIndex, maxValue + 1, () => {
          dischargeAllTurrets(impactedUnitIndex, unitsMap);
          explodeUnit(impactedUnitIndex);
          executeCombo();
        });
      },
      npc: () => {
        Playground.actingProjectilesNumber -= 1;

        if (impactWithExplodingUnit) {
          return;
        }

        setUnitValue(impactedUnitIndex, maxValue + 1, () => {
          dischargeAllTurrets(impactedUnitIndex, unitsMap);
          explodeUnit(impactedUnitIndex);
          executeCombo();
        });
      },
    };

    if (callbacks[units[impactedUnitIndex].type]) {
      callbacks[units[impactedUnitIndex].type]();
    }

    detectGameOutcome();
  };

  const applyLevelRestrictions = (level) => {
    if (level.ammoRestrictions) {
      dispatch(setAmmo({ ammoRestrictions: level.ammoRestrictions }));
    }
  };

  const performOverrideUserAmmo = (level) => {
    if (level.createUserBackup) {
      dispatch(setStash(user));
    }

    dispatch(setAmmo(level.ammo));
  };

  const restoreUserAmmo = () => {
    dispatch(setAmmo({ userStash }));
    dispatch(setStash({}));
  };

  const startLevel = (levelIndex, inNewGame) => {
    setLevelCounter(levelCounter + 1);

    const maps = readMaps();

    const maps0 = mapSet();

    console.log('maps0', maps0);

    if (!maps || !maps.length) {
      return;
    }

    const nextLevelIndex = levelIndex >= (maps.length) ? 0 : levelIndex;

    setCurrentLevel(nextLevelIndex);

    const level = new Map(maps[nextLevelIndex]);

    setMap(level);

    setGrid(level.grid);

    setUnits(level.units);

    applyLevelRestrictions(level);

    if (inNewGame) {
      dispatch(setAmmo(level.ammo));
    }

    if (level.overrideUserAmmo) {
      performOverrideUserAmmo(level);
    }

    if (level.restoreUserAmmo) {
      restoreUserAmmo();
    }

    setWinScreenVisible(false);
    setLoseScreenVisible(false);
  };

  const handleRestartClick = () => {
    dispatch(resetAmmo());
    startLevel(0);
  };

  const handleMenuClick = () => {
    dispatch(setCurrentScreen(SCREEN_MODES.menu));
  };

  const startNextLevel = () => {
    startLevel(currentLevel + 1);
  };

  useEffect(() => {
    startLevel(0, true);
  }, []);

  return (
    <>
      {winScreenVisible && (
        <div className="winMessage" onClick={startNextLevel}>
          <h1>You win</h1>
        </div>
      )}

      {loseScreenVisible && (
        <div className="loseMessage">
          <h1>You Loose</h1>
          <button type="button" className="button" onClick={handleRestartClick}>Restart</button>
          <button type="button" className="button" onClick={handleMenuClick}>Menu</button>
        </div>
      )}

      <div className="playgroundHeader">
        <h1 className="moves">
          Moves:
          {userMoves}
        </h1>

        <h3 className="currentLevel">
          CurrentLevel:
          {levelCounter}
        </h3>

        <button type="button" className="button" onClick={handleMenuClick}>Back to menu</button>
      </div>

      <div className="field" id="field">
        <div className="projectileLayer">
          {projectiles && projectiles.map((projectileProps) => (
            <Projectile
              key={projectileProps.id}
              units={units}
              potentialTargetsMap={unitsMap}
              fieldInfo={fieldInfo}
              onOutOfFiled={onOutOfFiled}
              onImpact={onImpact}
              moveStep={projectileMoveStep}
              {...projectileProps} // eslint-disable-line react/jsx-props-no-spreading
            />
          ))}
        </div>
        <div className="mapLayer">
          {grid.map((row, rowIndex) => (
            /* eslint-disable-next-line react/no-array-index-key */
            <React.Fragment key={rowIndex}>
              {row.map(({
                id, top, left, type,
              }, colIndex) => (
                <div
                  onClick={() => handleMapCellClick(id, rowIndex, colIndex)}
                  className={classnames('mapLayer-cell', `mapLayer-cell_${type}`, { selected: selectedCells.some((cell) => cell.id === id) })}
                  data-id={id}
                  key={id}
                  style={{
                    top: `${top}%`,
                    left: `${left}%`,
                    width: `${100 / map.mapWidth}%`,
                    height: `${100 / map.mapHeight}%`,
                  }}
                />
              ))}
            </React.Fragment>
          ))}
        </div>
        <div className="unitLayer">
          {units.map(({
            id, hitBoxRadius, type, kind, angle, value, maxValue, turrets, exploding, top, left,
          }, index) => (
            <Unit
              top={grid[top] && grid[top][left] && grid[top][left].top}
              left={grid[top] && grid[top][left] && grid[top][left].left}
              width={100 / map.mapWidth}
              height={100 / map.mapHeight}
              hitBoxRadius={hitBoxRadius}
              key={id}
              isSelected={selectedUnits.some((unit) => unit.unitId === id)}
              id={id}
              type={type}
              kind={kind}
              angle={angle}
              value={value}
              maxValue={maxValue}
              turrets={turrets}
              onClickHandler={handleUnitClick}
              exploding={exploding}
              idx={index}
            />
          ))}
        </div>
      </div>

      <UserMenu
        afterInputAction={afterInputAction}
        onModeChange={onModeChange}
      />
    </>
  );
}

Playground.propTypes = {
  projectileExplosionDuration: number,
  projectileMoveStep: number,
  baseWidthUnit: number,
};

Playground.defaultProps = {
  projectileExplosionDuration: 100,
  projectileMoveStep: 1,
  baseWidthUnit: 1,
};

Playground.actingProjectilesNumber = 0;

Playground.comboCounter = 0;
Playground.comboCursor = 0;

export default Playground;
