import React, { useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {number, string} from 'prop-types';

import { setCurrentScreen } from 'redux/ui/actions';
import { setMoves, setSwaps, setRotates, setAmmo, resetAmmo} from 'redux/user/actions';

import Projectile from '../Projectile';
import Unit from '../Unit';
import UserMenu from '../UserMenu';
import mapSet from 'maps/maps';

import { MULTISELECT_MODE, GAMEPLAY_MODE, SELECT_MODE, PlACING_MODE } from '../../constants/constants';
import {generateBobomb, generateDefault, generateLaser, generatePortals} from '../../maps/map_9x9_0';
import { SCREEN_MODES, START_MOVES } from '../../config/config';

import './Playground.scss';

const MAX_MULTISELECT = 2;

const Playground = ({ projectileExplosionDuration, projectileMoveStep }) => {
  const dispatch = useDispatch();

  const { moves, bobombs, defaults, lasers, portals, swaps, rotates } = useSelector(({ user }) => user);

  const [ userInputMode, setUserInputMode ] = useState(GAMEPLAY_MODE);
  const [ afterInputAction, setAfterInputAction ] = useState(null);

  const [ currentLevel, setCurrentLevel ] = useState(0);

  const [ levelCounter, setLevelCounter ] = useState(1);

  const [ map, setMap ] = useState(mapSet()[currentLevel]);
  const [ fieldInfo, setFieldInfo ] = useState({});

  const [ units, setUnits ] = useState(map.units);
  const [ selectedUnits, setSelectedUnits ] = useState([]);
  const [ unitsMap, setUnitsMap ] = useState([]);

  const [ projectiles, setProjectiles ] = useState([]);

  const [ winScreenVisible, setWinScreenVisible ] = useState(false);
  const [ loseScreenVisible, setLoseScreenVisible ] = useState(false);

  const generateUnitsMap = (fieldTop, fieldLeft) => {
    return [ ...document.querySelectorAll('.unit') ].map(unit => {
      const { dataset } = unit;
      const { index } = dataset;

      const { top, left } = unit.querySelector('.unit-pivot').getBoundingClientRect();

      const turretsData = [];

      const { turrets, angle: unitAngle, value, type, meta } = units[index];

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
      };
    })
  }

  const dischargeAllTurrets = (unitIndex, unitsMap) => {
    const { turrets } = unitsMap[unitIndex];

    const moveStep = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--base-width-unit'));

    turrets.forEach(turret => {
      const { gunpointTop: top, gunpointLeft: left, angle, type, maxDistance, speed } = turret;

      const id = Math.random().toString(16).substring(2);

      projectiles.push({
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
      if (afterInputAction === 'rotate_ccv' || afterInputAction === 'rotate_cv') {
        performRotate(unitIndex);
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

        if (afterInputAction === 'jump') {
          console.log('JUMP');

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
      }, projectileExplosionDuration + 300);
    }
  }

  const onOutOfFiled = () => {
    --Playground.actingProjectilesNumber;

    detectGameOutcome();
  }

  const onImpact = (projectileType, impactedUnitIndex) => {
    const { maxValue } = units[impactedUnitIndex];

    const callbacks = {
      default: () => {
        if (projectileType === 'default') {
          --Playground.actingProjectilesNumber;

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

        setUnitValue(impactedUnitIndex, units[impactedUnitIndex].value + 1, () => {
          dischargeAllTurrets(impactedUnitIndex, unitsMap);
          explodeUnit(impactedUnitIndex);
          executeCombo();
        });
      },
      bobomb: () => {
        --Playground.actingProjectilesNumber;

        setUnitValue(impactedUnitIndex, maxValue + 1, () => {
          dischargeAllTurrets(impactedUnitIndex, unitsMap);
          explodeUnit(impactedUnitIndex);
          executeCombo();
        });
      },
      npc: () => {
        --Playground.actingProjectilesNumber;

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
      dispatch(setMoves(moves + 1));
    },
    () => {
      dispatch(setAmmo({ bobombs: bobombs + 1 }));
    },
    () => {
      dispatch(setAmmo({ lasers: lasers + 1 }));
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

    setUserInputMode(GAMEPLAY_MODE);
    setSelectedUnits([]);

    dispatch(setRotates(rotates - 1));
  }

  const handleRestartClick = () => {
    dispatch(resetAmmo());
    startLevel(0);
  }

  const handleMenuClick = () => {
    dispatch(setCurrentScreen(SCREEN_MODES.menu));
  }

  const startLevel = (number) => {
    setLevelCounter(1);

    setCurrentLevel(number);

    const level = mapSet()[number];

    setMap(level);

    dispatch(setAmmo(level.ammo));
    setUnits(level.units);

    setWinScreenVisible(false);
    setLoseScreenVisible(false);
  }

  const startNextLevel = () => {
    setLevelCounter(levelCounter + 1);

    const maps = mapSet();

    const nextLevelIndex = currentLevel >= (maps.length - 1) ? 0 : currentLevel + 1;

    setCurrentLevel(nextLevelIndex);

    const nextLevel = maps[nextLevelIndex];

    setMap(nextLevel);
    setUnits(nextLevel.units);

    dispatch(setAmmo(nextLevel.ammo));

    setUnits(nextLevel.units);

    setWinScreenVisible(false);
  }

  const generateCoordinates = (gridWidth, gridHeight) => {
    const grid = [];

    for (let i = 0; i < gridHeight; ++i) {
      const row = [];

      for (let j = 0; j < gridWidth; ++j) {
        row[j] = {
          id: Math.random().toString(16).substring(2),
          left: j / gridWidth * 100,
          top: i / gridHeight * 100,
        };
      }

      grid.push(row);
    }

    return grid;
  };

  const grid = generateCoordinates(map.mapHeight, map.mapHeight);

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

      <h1 className="moves">moves: {moves}</h1>
      <h2 className="mode">gameplay mode: {userInputMode}</h2>
      <h3 className="currentLevel">currentLevel: {levelCounter}</h3>

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
              {row.map(({ id, top, left }, colIndex) => (
                <div
                  onClick={() => handleMapCellClick(id, rowIndex, colIndex)}
                  className="mapLayer-cell"
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
