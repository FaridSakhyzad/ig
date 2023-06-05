import React, { useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { number } from 'prop-types';
import Projectile from '../Projectile';
import Unit from '../Unit';
import UserMenu from '../UserMenu';
import mapSet from '../../maps/maps';
import './Playground.scss';
import { MULTISELECT_MODE, GAMEPLAY_MODE, SELECT_MODE, PlACING_MODE } from '../../constants/constants';
import { generateBobomb, generateDefault, generateLaser } from '../../maps/map_9x9_0';
import { setCurrentScreen } from '../../redux/ui/actions';
import { SCREEN_MODES, START_MOVES } from '../../config/config';
import { setSwaps, setRotates, setAmmo } from '../../redux/user/actions';

const MAX_MULTISELECT = 2;

const Playground = ({ projectileExplosionDuration, projectileMoveStep }) => {
  const dispatch = useDispatch();

  const { bobombs, defaults, lasers, swaps, rotates } = useSelector(({ user }) => user);

  const [ userInputMode, setUserInputMode ] = useState(GAMEPLAY_MODE);
  const [ afterInputAction, setAfterInputAction ] = useState(null);

  const [ unitPlacementType, setUnitPlacementType ] = useState('');

  const [ currentLevel, setCurrentLevel ] = useState(0);

  const [ levelCounter, setLevelCounter ] = useState(1);

  const [ map, setMap ] = useState(mapSet()[currentLevel]);
  const [ fieldInfo, setFieldInfo ] = useState({});

  const [ units, setUnits ] = useState(map.units);
  const [ selectedUnits, setSelectedUnits ] = useState([]);
  const [ unitsMap, setUnitsMap ] = useState([]);

  const [ projectiles, setProjectiles ] = useState([]);

  const [ moves, setMoves ] = useState(START_MOVES);
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
    const newMoves = moves - 1;

    if (!shiftKey && !altKey) {
      setMoves(newMoves);
    }

    return newMoves;
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

        const newMoves = setNewMovesCount();
        detectUserMoveOutcome(newMoves);
      },
      wall: () => {},
      portal: () => {},
      hidden: () => {
        setUnitValue(unitIndex, newValue, () => {
          dischargeAllTurrets(unitIndex, unitsMap);
          explodeUnit(unitIndex);
        });

        const newMoves = setNewMovesCount();
        detectUserMoveOutcome(newMoves);
      },
      laser: () => {
        setUnitValue(unitIndex, newValue, () => {
          dischargeAllTurrets(unitIndex, unitsMap);
          explodeUnit(unitIndex);
        });

        const newMoves = setNewMovesCount();
        detectUserMoveOutcome(newMoves);
      },
      bobomb: () => {
        setUnitValue(unitIndex, newValue, () => {
          dischargeAllTurrets(unitIndex, unitsMap);
          explodeUnit(unitIndex);
        });

        const newMoves = setNewMovesCount();
        detectUserMoveOutcome(newMoves);
      },
    }

    callbacks[units[unitIndex].type]();
  }

  const handleUnitClick = (e, unitId, unitIndex) => {
    if (Playground.actingProjectilesNumber > 0) {
      return;
    }

    if (userInputMode === GAMEPLAY_MODE) {
      makePlayerMove(e, unitId, unitIndex);
    }

    if (userInputMode === PlACING_MODE) {
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

      const newUnit = generators[unitPlacementType]();

      const newUnits = [ ...units ];

      newUnits[unitIndex] = newUnit;

      setUnits(newUnits);

      callbacks[unitPlacementType]();

      setUserInputMode(GAMEPLAY_MODE);
    }

    if (userInputMode === SELECT_MODE) {
      setSelectedUnits([{ unitId, unitIndex }]);
    }

    if (userInputMode === MULTISELECT_MODE) {
      /*
      const selectedIndex = selectedUnits.findIndex(unit => unit.unitId === unitId)

      if (selectedIndex >= 0) {
        selectedUnits.splice(selectedIndex, 1);
      } else {
        if (selectedUnits.length >= MAX_MULTISELECT) {
          selectedUnits.splice(selectedUnits.length - 1, 1);
        }

        selectedUnits.push({ unitId, unitIndex })
      }
      */

      selectedUnits.push({ unitId, unitIndex });
      setSelectedUnits([ ...selectedUnits ]);

      if (selectedUnits.length >= MAX_MULTISELECT && afterInputAction === 'swap') {
        performSwap();
      }

      const { fieldTop, fieldLeft } = fieldInfo;
      const unitsMap = generateUnitsMap(fieldTop, fieldLeft);
      setUnitsMap(unitsMap);
    }
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
          });
        }

        if (projectileType === 'laser') {
          setUnitValue(impactedUnitIndex, maxValue + 1, () => {
            dischargeAllTurrets(impactedUnitIndex, unitsMap);
            explodeUnit(impactedUnitIndex);
          });
        }

        if (projectileType === 'bobomb') {
          --Playground.actingProjectilesNumber;

          setUnitValue(impactedUnitIndex, maxValue + 1, () => {
            dischargeAllTurrets(impactedUnitIndex, unitsMap);
            explodeUnit(impactedUnitIndex);
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
        });
      },
      bobomb: () => {
        --Playground.actingProjectilesNumber;

        setUnitValue(impactedUnitIndex, maxValue + 1, () => {
          dischargeAllTurrets(impactedUnitIndex, unitsMap);
          explodeUnit(impactedUnitIndex);
        });
      },
    }

    callbacks[units[impactedUnitIndex].type]();

    detectGameOutcome();
  }

  const onModeChange = (mode, meta) => {
    setAfterInputAction(meta.callback);
    setUserInputMode(mode);
  }

  const onConfirm = (action) => {
    if (!action || !action.type) {
      return;
    }

    console.log('onConfirm', action);

    if (action.type === 'swap' && selectedUnits.length === 2) {
      performSwap();
    }

    if (action.type === 'rotate') {
      dispatch(setRotates(rotates - 1));
    }

    setUserInputMode(GAMEPLAY_MODE);
    setSelectedUnits([]);
  }

  const performSwap = () => {
    const newUnits = [ ...units ];

    const { unitIndex: unit0Index } = selectedUnits[0];
    const { unitIndex: unit1Index } = selectedUnits[1];

    const unit0 = structuredClone(newUnits[unit0Index]);

    newUnits[unit0Index] = newUnits[unit1Index];
    newUnits[unit1Index] = unit0;

    setUnits(newUnits);

    dispatch(setSwaps(swaps - 1));
  }

  const onCancel = () => {
    setSelectedUnits([]);
  };

  const rotateSelectedUnit = (direction) => {
    const { unitIndex } = selectedUnits[0];
    const newUnits = [ ...units ];

    const directionMultiplier = direction === 'ccv' ? -1 : 1;

    newUnits[unitIndex].angle += (45 * directionMultiplier);
    setUnits(newUnits);
  }

  const placementTypeChange = (unitType) => {
    setUnitPlacementType(unitType);
  }

  const handleRestartClick = () => {
    setMoves(START_MOVES);
    startLevel(0);
  }

  const handleMenuClick = () => {
    dispatch(setCurrentScreen(SCREEN_MODES.menu));
  }

  const startLevel = (number) => {
    setLevelCounter(1);

    setCurrentLevel(number);
    setMap(mapSet()[number]);
    setUnits(mapSet()[number].units);

    setWinScreenVisible(false);
    setLoseScreenVisible(false);
  }

  const startNextLevel = () => {
    setLevelCounter(levelCounter + 1);

    const nextLevel = currentLevel >= (mapSet.length - 1) ? 0 : currentLevel + 1;

    setCurrentLevel(nextLevel);
    setMap(mapSet()[nextLevel]);
    setUnits(mapSet()[nextLevel].units);

    setMoves(START_MOVES);

    setWinScreenVisible(false);
  }

  const getGridStyle = () => {
    const { gridWidth: gridWidthInitial, gridHeight: gridHeightInitial, mapWidth: mapWidthInitial, mapHeight: mapHeightInitial } = map;

    const gridWidth = gridWidthInitial >= gridHeightInitial ? gridWidthInitial : gridHeightInitial;
    const gridHeight = gridHeightInitial >= gridWidthInitial ? gridHeightInitial : gridWidthInitial;

    const mapWidth = mapWidthInitial >= mapHeightInitial ? mapWidthInitial : mapHeightInitial;
    const mapHeight = mapHeightInitial >= mapWidthInitial ? mapHeightInitial : mapWidthInitial;

    return {
      '--grid-width': mapWidth <= gridWidth ? gridWidth : mapWidth,
      '--grid-height': mapHeight <= gridHeight ? gridHeight : mapHeight,
    };
  }

  const getMapStyle = () => {
    const { gridWidth: gridWidthInitial, gridHeight: gridHeightInitial, mapWidth, mapHeight } = map;

    let gridWidth = gridWidthInitial >= gridHeightInitial ? gridWidthInitial : gridHeightInitial;
    let gridHeight = gridHeightInitial >= gridWidthInitial ? gridHeightInitial : gridWidthInitial;

    gridWidth = gridWidth > mapHeight ? gridWidth : mapHeight;
    gridHeight = gridHeight > mapWidth ? gridHeight : mapWidth;

    const mapStyle = {
      '--map-width': mapWidth,
      '--map-height': mapHeight,
    }

    const rowStartOffset = gridHeight > mapHeight ? (gridHeight - mapHeight) / 2 : 0;
    const colStartOffset = gridWidth > mapWidth ? (gridWidth - mapWidth) / 2 : 0;

    const fitMapIntoGrid = {
      gridRowStart: rowStartOffset + 1,
      gridColumnStart: colStartOffset + 1,
      gridRowEnd: gridHeight > mapHeight ? gridHeight - rowStartOffset + 1 : mapHeight + 1,
      gridColumnEnd: gridWidth > mapWidth ? gridWidth - colStartOffset + 1 : mapWidth + 1,
    }

    return {
      ...fitMapIntoGrid,
      ...mapStyle,
    }
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
        <div className="unitLayerGrid" style={getGridStyle()}>
          <div className="mapLayer" style={getMapStyle()}>
            {units.map(({ id, type, angle, value, maxValue, turrets, exploding }, index) => (
              <Unit
                key={id}
                isSelected={selectedUnits.some(unit => unit.unitId === id)}
                id={id}
                type={type}
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
      </div>

      <UserMenu
        userInputMode={userInputMode}
        onModeChange={onModeChange}
        onRotate={rotateSelectedUnit}
        onPlacementTypeChange={placementTypeChange}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    </>
  )
}

Playground.propTypes = {
  projectileExplosionDuration: number,
  projectileMoveStep: number,
}

Playground.actingProjectilesNumber = 0;

export default Playground;
