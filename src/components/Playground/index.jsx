import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
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

import { generatePortals, generateTeleports } from 'units/unitFactory';

import BaseUnit from 'units/BaseUnit';
import Bobomb from 'units/Bobomb';
import Laser from 'units/Laser';
import Deflector from 'units/Deflector';
import Wall from 'units/Wall';
import Npc from 'units/Npc';
import Hidden from 'units/Hidden';

import {
  ITEM_MULTISELECT_MODE,
  CELL_MULTISELECT_MODE,
  GAMEPLAY_MODE,
  SELECT_MODE,
  PLACING_MODE,
  SCREEN_MODES,
} from 'constants/constants';

import { DEFAULT_MAP_WIDTH } from 'config/config';

import Projectile from '../Projectile';
import Unit from '../Unit';
import UserMenu from '../UserMenu';

import './Playground.scss';
import {
  BASE_UNIT,
  BOBOMB,
  LASER,
  DEFLECTOR,
  WALL,
  NPC,
  HIDDEN,
} from '../../constants/units';

const MAX_MULTISELECT = 2;

function Playground(props) {
  const {
    projectileExplosionDuration,
    projectileMoveStep,
    level: levelFromProp,
    onPlayNextLevel,
    renderPlayGroundEdit,
    onUnitClick,
    onCellClick,
  } = props;

  const dispatch = useDispatch();

  const { user, userStash } = useSelector((state) => state);

  const {
    editorMode,

    userMoves,
    bobombs,
    defaults,
    lasers,
    portals,
    teleports,
    swaps,
    rotates,
    jumps,
    deflectors,
    walls,
  } = user;

  const [userInputMode, setUserInputMode] = useState(GAMEPLAY_MODE);
  const [afterInputAction, setAfterInputAction] = useState(null);

  const [level, setLevel] = useState({});
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
      turrets,
      angle: unitAngle,
      value,
      type,
      meta,
      explosionStart,
      hitBoxRadius,
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

    const newUnits = [...units];

    setUnits(newUnits);
  };

  const placeUnit = (newUnitTop, newUnitLeft) => {
    const generators = {
      [BASE_UNIT.id]: (unitTop, unitLeft, params) => new BaseUnit(unitTop, unitLeft, params),
      [BOBOMB.id]: (unitTop, unitLeft, params) => new Bobomb(unitTop, unitLeft, params),
      [LASER.id]: (unitTop, unitLeft, params) => new Laser(unitTop, unitLeft, params),
      [DEFLECTOR.id]: (unitTop, unitLeft, params) => new Deflector(unitTop, unitLeft, params),
      [WALL.id]: (unitTop, unitLeft, params) => new Wall(unitTop, unitLeft, params),
      [NPC.id]: (unitTop, unitLeft, params) => new Npc(unitTop, unitLeft, params),
      [HIDDEN.id]: (unitTop, unitLeft, params) => new Hidden(unitTop, unitLeft, params),
    };

    const callbacks = {
      [BASE_UNIT.id]: () => dispatch(setAmmo({ defaults: defaults - 1 })),
      [BOBOMB.id]: () => dispatch(setAmmo({ bobombs: bobombs - 1 })),
      [LASER.id]: () => dispatch(setAmmo({ lasers: lasers - 1 })),
      [DEFLECTOR.id]: () => dispatch(setAmmo({ deflectors: deflectors - 1 })),
      [WALL.id]: () => dispatch(setAmmo({ walls: walls - 1 })),
      [NPC.id]: () => {},
      [HIDDEN.id]: () => {},
    };

    const newUnit = generators[afterInputAction](newUnitTop, newUnitLeft, { value: 4 });

    const newUnits = [...units];

    newUnits.push(newUnit);

    setUnits(newUnits);

    callbacks[afterInputAction]();
  };

  const handleUnitClick = (e, unitId, unitIndex) => {
    if (editorMode) {
      onUnitClick(unitId, unitIndex);
      return;
    }

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

  const handleGridCellClick = (id, top, left) => {
    if (editorMode) {
      onCellClick(id, top, left);
      return;
    }

    if (userInputMode === PLACING_MODE) {
      placeUnit(top, left);
      setUserInputMode(GAMEPLAY_MODE);
      setAfterInputAction(null);
    }

    if (userInputMode === SELECT_MODE && afterInputAction === 'jump') {
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

          dispatch(setAmmo({ portals: portals - 1 }));

          setUserInputMode(GAMEPLAY_MODE);
          setSelectedCells([]);
        }

        if (afterInputAction === 'teleport') {
          placeTeleports();

          dispatch(setAmmo({ teleports: teleports - 1 }));

          setUserInputMode(GAMEPLAY_MODE);
          setSelectedCells([]);
        }

        setAfterInputAction(null);
      }
    }
  };

  const applyLevelPenalty = (penalty) => {
    const reward = {};

    if (!penalty) {
      return;
    }

    Object.keys(penalty).forEach((key) => {
      reward[key] = user[key] - penalty[key];
    });

    dispatch(setAmmo(reward));
  };

  const applyLevelReward = (reward) => {
    const newReward = {};

    if (!reward) {
      return;
    }

    Object.keys(reward).forEach((key) => {
      newReward[key] = user[key] + reward[key];
    });

    dispatch(setAmmo(newReward));
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

        applyLevelReward(level.reward);
        applyLevelPenalty(level.penalty);
      }, projectileExplosionDuration + 300);
    }
  };

  const onOutOfFiled = () => {
    Playground.actingProjectilesNumber -= 1;

    detectGameOutcome();
  };

  const combosRewards = [
    () => {
      // eslint-disable-next-line no-console
      console.log('FIRST COMBO !!!');
    },
    () => {
      // eslint-disable-next-line no-console
      console.log('SECOND COMBO !!!');
    },
    () => {
      // eslint-disable-next-line no-console
      console.log('THIRD COMBO !!!');
    },
  ];

  const executeCombo = () => {
    Playground.comboCounter += 1;

    if (Playground.comboCounter === level.comboSequence[Playground.comboCursor]) {
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

  const applyLevelRestrictions = (restrictions) => {
    if (restrictions) {
      dispatch(setAmmo({ ammoRestrictions: restrictions }));
    }
  };

  const performOverrideUserAmmo = (ammo, createUserBackup) => {
    if (createUserBackup) {
      dispatch(setStash(user));
    }

    dispatch(setAmmo(ammo));
  };

  const restoreUserAmmo = () => {
    dispatch(setAmmo({ userStash }));
    dispatch(setStash({}));
  };

  const startLevel = () => {
    setLevel(levelFromProp);

    setGrid(levelFromProp.grid);

    setUnits(levelFromProp.units);

    applyLevelRestrictions(levelFromProp.ammoRestrictions);

    if (levelFromProp.overrideUserAmmo) {
      performOverrideUserAmmo(levelFromProp.ammo, levelFromProp.createUserBackup);
    }

    if (levelFromProp.restoreUserAmmo) {
      restoreUserAmmo();
    }

    setWinScreenVisible(false);
    setLoseScreenVisible(false);
  };

  const handleRestartClick = () => {
    dispatch(resetAmmo());
    startLevel();
  };

  const handleMenuClick = () => {
    dispatch(setCurrentScreen(SCREEN_MODES.menu));
  };

  const startNextLevel = () => {
    onPlayNextLevel();
  };

  useEffect(() => {
    startLevel();
  }, [levelFromProp]);

  const handleSettingsClick = () => {
    // eslint-disable-next-line no-console
    console.log('handleSettingsClick');
  };

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
        <div className="row">
          <div className="col">
            <button type="button" className="playgroundMenuButton" onClick={handleMenuClick}>Menu</button>
          </div>
          <div className="col">
            <h1 className="moves">Moves: {userMoves}</h1>
          </div>
          <div className="col">
            <button type="button" className="playgroundSettingsButton" onClick={handleSettingsClick}>Settings</button>
          </div>
        </div>
        <h3 className="currentLevel">№{level.index + 1}. {level.name}</h3>
      </div>

      <div className="field" id="field">
        <div className="projectileLayer">
          {projectiles && projectiles.map((projectileProps) => (
            <Projectile
              horCoefficient={DEFAULT_MAP_WIDTH / level.mapWidth}
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
                id, top, left, type, selected,
              }, colIndex) => (
                <div
                  onClick={() => handleGridCellClick(id, rowIndex, colIndex)}
                  className={classnames('mapLayer-cell', type, { selected: selected || selectedCells.some((cell) => cell.id === id) })}
                  data-id={id}
                  key={id}
                  style={{
                    top: `${top}%`,
                    left: `${left}%`,
                    width: `${100 / level.mapWidth}%`,
                    height: `${100 / level.mapHeight}%`,
                  }}
                />
              ))}
            </React.Fragment>
          ))}
        </div>
        <div className="unitLayer">
          {units.map(({
            id,
            hitBoxRadius,
            type,
            kind,
            angle,
            value,
            maxValue,
            turrets,
            exploding,
            top,
            left,
            selected,
          }, index) => (
            <Unit
              top={grid[top] && grid[top][left] && grid[top][left].top}
              left={grid[top] && grid[top][left] && grid[top][left].left}
              width={100 / level.mapWidth}
              height={100 / level.mapHeight}
              hitBoxRadius={hitBoxRadius}
              key={id}
              isSelected={selected || selectedUnits.some((unit) => unit.unitId === id)}
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

      {renderPlayGroundEdit()}

      <UserMenu
        afterInputAction={afterInputAction}
        onModeChange={onModeChange}
      />
    </>
  );
}

Playground.propTypes = {
  projectileExplosionDuration: PropTypes.number,
  projectileMoveStep: PropTypes.number,
  baseWidthUnit: PropTypes.number,
  // eslint-disable-next-line react/forbid-prop-types
  level: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  onPlayNextLevel: PropTypes.func,
  renderPlayGroundEdit: PropTypes.func,
  onUnitClick: PropTypes.func,
  onCellClick: PropTypes.func,
};

Playground.defaultProps = {
  projectileExplosionDuration: 100,
  projectileMoveStep: 1,
  baseWidthUnit: 1,
  onPlayNextLevel: () => {},
  renderPlayGroundEdit: () => null,
  onUnitClick: null,
  onCellClick: null,
};

Playground.actingProjectilesNumber = 0;

Playground.comboCounter = 0;
Playground.comboCursor = 0;

export default Playground;
