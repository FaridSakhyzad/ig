import React, { useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { number } from 'prop-types';
import classnames from 'classnames';

import { setCurrentScreen } from 'redux/ui/actions';
import { setMoves, setSwaps, setRotates, setAmmo, resetAmmo } from 'redux/user/actions';
import { setStash } from 'redux/userStash/actions';

import Projectile from '../Projectile';
import Unit from '../Unit';
import UserMenu from '../UserMenu';
import mapSet from 'maps/maps';

import { MULTISELECT_MODE, GAMEPLAY_MODE, SELECT_MODE, PlACING_MODE } from '../../constants/constants';
import { generateBobomb, generateDefault, generateLaser, generatePortals } from '../../maps/map_9x9_0';
import { SCREEN_MODES } from '../../config/config';

import './Playground.scss';

const MAX_MULTISELECT = 2;

const Playground = ({ projectileExplosionDuration, projectileMoveStep }) => {
  const dispatch = useDispatch();

  const user = useSelector(({ user }) => user);
  const userStash = useSelector(({ userStash }) => userStash);

  const { moves, bobombs, defaults, lasers, portals, swaps, rotates, jumps } = user;

  const [ userInputMode, setUserInputMode ] = useState(GAMEPLAY_MODE);
  const [ afterInputAction, setAfterInputAction ] = useState(null);

  const [ currentLevel, setCurrentLevel ] = useState(0);

  const [ levelCounter, setLevelCounter ] = useState(1);

  const [ map, setMap ] = useState(mapSet()[currentLevel]);
  const [ fieldInfo, setFieldInfo ] = useState({});

  const [ grid, setGrid ] = useState(map.grid);

  const [ units, setUnits ] = useState(map.units);
  const [ selectedUnits, setSelectedUnits ] = useState([]);
  const [ unitsMap, setUnitsMap ] = useState([]);

  const [ selectedCells, setSelectedCells ] = useState([]);

  const [ projectiles, setProjectiles ] = useState([]);

  const [ winScreenVisible, setWinScreenVisible ] = useState(false);
  const [ loseScreenVisible, setLoseScreenVisible ] = useState(false);

  const generateUnitsMap = (fieldTop, fieldLeft) => {
    return [ ...document.querySelectorAll('.unit') ].map(unit => {
      const { dataset } = unit;
      const { index } = dataset;

      const { top, left } = unit.querySelector('.unit-pivot').getBoundingClientRect();

      const turretsData = [];

      const { turrets, angle: unitAngle, value, type, meta, explosionStart } = units[index];

      unit.querySelectorAll('.turret').forEach(turret => {
        const gunpoint = turret.querySelector('.gunpoint');
        const { name: turretName } = turret.dataset;
        const { top: gunpointTop, left: gunpointLeft } = gunpoint.getBoundingClientRect();

        const { angle, type, maxDistance, speed } = turrets.find(({ name }) => (name === turretName));

        turretsData.push({
          turretName,
          gunpointTop: gunpointTop - fieldTop,
          gunpointLeft: gunpointLeft - fieldLeft,
          angle: unitAngle + angle,
          type,
          maxDistance,
          speed,
        })
      });

      return {
        id: unit.id,
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
    })
  }

  const dischargeAllTurrets = (unitIndex, unitsMap) => {
    const { id: unitOfOriginId, turrets } = unitsMap[unitIndex];

    const moveStep = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--base-width-unit'));

    turrets.forEach(turret => {
      const { gunpointTop: top, gunpointLeft: left, angle, type, maxDistance, speed } = turret;

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
        moveStep
      });
    })

    Playground.actingProjectilesNumber += turrets.length;

    setProjectiles(projectiles);
  }

  const explodeUnit = (unitIndex) => {
    const newUnits = [ ...units ];

    newUnits[unitIndex].exploding = true;

    newUnits[unitIndex].explosionStart = +Date.now();
    newUnits[unitIndex].value = newUnits[unitIndex].minValue;

    setUnits(newUnits);
  };

  const setUnitValue = (unitIndex, newValue, onValueExceed) => {
    const newUnits = [ ...units ];
    const { maxValue, minValue } = newUnits[unitIndex];

    if (newValue > maxValue) {
      onValueExceed();
      newUnits[unitIndex].value = minValue;
    } else {
      newUnits[unitIndex].value = newValue;
      newUnits[unitIndex].exploding = false;
    }

    setUnits(newUnits);
  }

  const detectUserMoveOutcome = (moves) => {
    if (Playground.actingProjectilesNumber === 0 && moves <= 0) {
      setLoseScreenVisible(true);
    }
  }

  const setNewMovesCount = (altKey, shiftKey) => {
    if (!shiftKey && !altKey) {
      dispatch(setMoves(moves - 1));
    }

    return moves - 1;
  }

  const makePlayerMove = (e, unitId, unitIndex) => {
    setProjectiles([]);

    const { top: fieldTop, left: fieldLeft, width: fieldWidth, height: fieldHeight } = document.querySelector('#field').getBoundingClientRect();

    const fieldInfo = { fieldTop, fieldLeft, fieldWidth, fieldHeight };
    const unitsMap = generateUnitsMap(fieldTop, fieldLeft);

    setFieldInfo(fieldInfo);
    setUnitsMap(unitsMap);

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
          dischargeAllTurrets(unitIndex, unitsMap);
          explodeUnit(unitIndex);
        });

        const newMoves = setNewMovesCount(altKey, shiftKey);
        detectUserMoveOutcome(newMoves);
      },
      wall: () => {},
      portal: () => {},
      hidden: () => {
        setUnitValue(unitIndex, newValue, () => {
          dischargeAllTurrets(unitIndex, unitsMap);
          explodeUnit(unitIndex);
        });

        const newMoves = setNewMovesCount(altKey, shiftKey);
        detectUserMoveOutcome(newMoves);
      },
      laser: () => {
        setUnitValue(unitIndex, newValue, () => {
          dischargeAllTurrets(unitIndex, unitsMap);
          explodeUnit(unitIndex);
        });

        const newMoves = setNewMovesCount(altKey, shiftKey);
        detectUserMoveOutcome(newMoves);
      },
      bobomb: () => {
        setUnitValue(unitIndex, newValue, () => {
          dischargeAllTurrets(unitIndex, unitsMap);
          explodeUnit(unitIndex);
        });

        const newMoves = setNewMovesCount(altKey, shiftKey);
        detectUserMoveOutcome(newMoves);
      },
    }

    callbacks[units[unitIndex].type] && callbacks[units[unitIndex].type]();
  }

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

    if (userInputMode === PlACING_MODE) {
      const { top, left } = units[unitIndex];

      removeUnit(unitIndex);
      placeUnit(top, left);

      setUserInputMode(GAMEPLAY_MODE);
      setAfterInputAction(null);
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

      if (afterInputAction === 'rotate_ccv' || afterInputAction === 'rotate_cv') {
        performRotate(unitIndex);

        setUserInputMode(GAMEPLAY_MODE);
        setSelectedUnits([]);
        setAfterInputAction(null);
      }
    }

    if (userInputMode === MULTISELECT_MODE) {
      selectedUnits.push({ unitId, unitIndex });
      setSelectedUnits([ ...selectedUnits ]);

      if (selectedUnits.length >= MAX_MULTISELECT) {
        if (afterInputAction === 'swap') {
          performSwap();

          setUserInputMode(GAMEPLAY_MODE);
          setSelectedUnits([]);
        }

        if (afterInputAction === 'portal') {
          placePortals();

          setUserInputMode(GAMEPLAY_MODE);
          setSelectedUnits([]);
        }

        setAfterInputAction(null);
      }

      const { fieldTop, fieldLeft } = fieldInfo;
      const unitsMap = generateUnitsMap(fieldTop, fieldLeft);
      setUnitsMap(unitsMap);
    }
  }

  const handleMapCellClick = (id, top, left) => {
    if (userInputMode === PlACING_MODE) {
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
  }

  const removeUnit = (index) => {
    setUnits(units.splice(index, 1));
  }

  const placeUnit = (top, left) => {
    const generators = {
      'default': generateDefault,
      'bobomb': generateBobomb,
      'laser': generateLaser,
    }

    const callbacks = {
      'default': () => dispatch(setAmmo({ defaults: defaults - 1 })),
      'bobomb': () => dispatch(setAmmo({ bobombs: bobombs - 1 })),
      'laser': () => dispatch(setAmmo({ lasers: lasers - 1 })),
    }

    const newUnit = generators[afterInputAction]();

    newUnit.top = top;
    newUnit.left = left;

    const newUnits = [ ...units ];

    newUnits.push(newUnit);

    setUnits(newUnits);

    callbacks[afterInputAction]();
  }

  const detectGameOutcome = () => {
    if (Playground.actingProjectilesNumber !== 0) {
      return;
    }

    const someUnitsLeft = units.some((unit) => unit.valueCountable && unit.value > 0);

    if (moves < 1 && someUnitsLeft) {
      setLoseScreenVisible(true);
      return;
    }

    if (moves >= 0 && !someUnitsLeft) {
      setTimeout(() => {
        setWinScreenVisible(true);

        applyLevelReward(map);
        applyLevelPenalty(map);

      }, projectileExplosionDuration + 300);
    }
  }

  const onOutOfFiled = () => {
    --Playground.actingProjectilesNumber;

    detectGameOutcome();
  }

  const onImpact = (projectileType, impactedUnitIndex, impactWithExplodingUnit) => {
    const { maxValue } = units[impactedUnitIndex];

    const callbacks = {
      default: () => {
        if (projectileType === 'default') {
          --Playground.actingProjectilesNumber;

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
          --Playground.actingProjectilesNumber;

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
        --Playground.actingProjectilesNumber;
      },
      laser: () => {
        --Playground.actingProjectilesNumber;

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
        --Playground.actingProjectilesNumber;

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
        --Playground.actingProjectilesNumber;

        if (impactWithExplodingUnit) {
          return;
        }

        setUnitValue(impactedUnitIndex, maxValue + 1, () => {
          dischargeAllTurrets(impactedUnitIndex, unitsMap);
          explodeUnit(impactedUnitIndex);
          executeCombo();
        });
      }
    }

    callbacks[units[impactedUnitIndex].type] && callbacks[units[impactedUnitIndex].type]();

    detectGameOutcome();
  }

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
      combosRewards[Playground.comboCursor] && combosRewards[Playground.comboCursor]();

      Playground.comboCounter = 0;
      Playground.comboCursor += 1;
    }
  }

  const onModeChange = (mode, data) => {
    setAfterInputAction(data.callback);
    setUserInputMode(mode);
  }

  const performSwap = () => {
    const newUnits = [ ...units ];

    const { unitIndex: unit0Index } = selectedUnits[0];
    const { unitIndex: unit1Index } = selectedUnits[1];

    const { top: top0, left: left0 } = newUnits[unit0Index];

    newUnits[unit0Index].top = newUnits[unit1Index].top;
    newUnits[unit0Index].left = newUnits[unit1Index].left;

    newUnits[unit1Index].top = top0;
    newUnits[unit1Index].left = left0;

    setUnits(newUnits);

    dispatch(setSwaps(swaps - 1));
  }

  const placePortals = () => {
    const newUnits = [ ...units ];

    const { unitIndex: unit0Index } = selectedUnits[0];
    const { unitIndex: unit1Index } = selectedUnits[1];

    const { top: top0, left: left0 } = newUnits[unit0Index];
    const { top: top1, left: left1 } = newUnits[unit1Index];

    const [ portal1, portal2 ] = generatePortals(top0, left0, top1, left1);

    newUnits[unit0Index] = portal1;
    newUnits[unit1Index] = portal2;

    setUnits(newUnits);

    dispatch(setAmmo({ portals: portals - 1 }));
  }

  const performRotate = (unitIndex, angle = 45) => {
    const newUnits = [ ...units ];

    const directionMultiplier = afterInputAction === 'rotate_ccv' ? -1 : 1;

    newUnits[unitIndex].angle += (angle * directionMultiplier);
    setUnits(newUnits);

    dispatch(setRotates(rotates - 1));
  }

  const performJump = (unitIndex, top, left) => {
    units[unitIndex].top = top;
    units[unitIndex].left = left;

    setUnits([...units]);

    dispatch(setAmmo({ jumps: jumps - 1 }));
  }

  const handleRestartClick = () => {
    dispatch(resetAmmo());
    startLevel(0);
  }

  const handleMenuClick = () => {
    dispatch(setCurrentScreen(SCREEN_MODES.menu));
  }

  const startLevel = (levelIndex) => {
    setLevelCounter(levelCounter + 1);

    const maps = mapSet();

    const nextLevelIndex = levelIndex >= (maps.length) ? 0 : levelIndex;

    setCurrentLevel(nextLevelIndex);

    const level = maps[nextLevelIndex];

    setMap(level);

    setGrid(level.grid);

    setUnits(level.units);

    if (level.overrideUserAmmo) {
      applyLevelAmmo(level, level.createUserBackup);
    }

    if (level.restoreUserAmmo) {
      restoreUserAmmo();
    }

    setWinScreenVisible(false);
    setLoseScreenVisible(false);
  }

  const applyLevelAmmo = (level, createBackup) => {
    if (createBackup) {
      dispatch(setStash(user));
    }

    dispatch(setAmmo(level.ammo));
  }

  const restoreUserAmmo = () => {
    dispatch(setAmmo({ userStash }));
    dispatch(setStash({}));
  }

  const startNextLevel = () => {
    startLevel(currentLevel + 1);
  }

  const applyLevelPenalty = (level) => {
    const reward = {};

    if (!level.penalty) {
      return
    }

    Object.keys(level.penalty).forEach(key => reward[key] = user[key] - level.penalty[key]);

    dispatch(setAmmo(reward));
  }

  const applyLevelReward = (level) => {
    const reward = {};

    if (!level.reward) {
      return
    }

    Object.keys(level.reward).forEach(key => reward[key] = user[key] + level.reward[key]);

    dispatch(setAmmo(reward));
  }

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
            <button className="button" onClick={handleRestartClick}>Restart</button>
            <button className="button" onClick={handleMenuClick}>Menu</button>
          </div>
      )}

      <h1 className="moves">Moves: {moves}</h1>
      <h2 className="mode">Gameplay mode: {userInputMode}</h2>
      <h3 className="currentLevel">CurrentLevel: {levelCounter}</h3>

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
              {...projectileProps}
            />
          ))}
        </div>
        <div className="mapLayer">
          {grid.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {row.map(({ id, top, left, type }, colIndex) => (
                <div
                  onClick={() => handleMapCellClick(id, rowIndex, colIndex)}
                  className={classnames('mapLayer-cell', `mapLayer-cell_${type}`, { selected: selectedCells.some(cell => cell.id === id) })}
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
          {units.map(({ id, type, kind, angle, value, maxValue, turrets, exploding, top, left }, index) => (
            <Unit
              top={grid[top][left].top}
              left={grid[top][left].left}
              width={100 / map.mapWidth}
              height={100 / map.mapHeight}
              key={id}
              isSelected={selectedUnits.some(unit => unit.unitId === id)}
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
  )
}

Playground.propTypes = {
  projectileExplosionDuration: number,
  projectileMoveStep: number,
}

Playground.actingProjectilesNumber = 0;

Playground.comboCounter = 0;
Playground.comboCursor = 0;

export default Playground;
