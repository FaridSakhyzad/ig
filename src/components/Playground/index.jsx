import React, { useState } from 'react';
import { number } from 'prop-types';
import Projectile from '../Projectile';
import Unit from '../Unit';
import UserMenu from '../UserMenu';
import mapSet from '../../maps/maps';
import './Playground.scss';
import { MULTISELECT_MODE, GAMEPLAY_MODE, SELECT_MODE } from '../../constants/constants';

const MAX_MULTISELECT = 2;

const Playground = ({ projectileExplosionDuration, projectileMoveStep }) => {
  const [ userInputMode, setUserInputMode ] = useState(GAMEPLAY_MODE);

  const [ currentLevel, setCurrentLevel ] = useState(0);

  const [ map, setMap ] = useState(mapSet[currentLevel]);
  const [ fieldInfo, setFieldInfo ] = useState({});

  const [ units, setUnits ] = useState(map.units);
  const [ selectedUnits, setSelectedUnits ] = useState([]);
  const [ unitsMap, setUnitsMap ] = useState([]);

  const [ projectiles, setProjectiles ] = useState([]);

  const [ moves, setMoves ] = useState(1000);
  const [ winScreenVisible, setWinScreenVisible ] = useState(false);

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
      setTimeout(() => { alert('On Click You Loose') }, 300);
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

  const onClick = (e, unitId, unitIndex) => {
    if (Playground.actingProjectilesNumber > 0) {
      return;
    }

    if (userInputMode === GAMEPLAY_MODE) {
      makePlayerMove(e, unitId, unitIndex);
    }

    if (userInputMode === SELECT_MODE) {
      setSelectedUnits([{ unitId, unitIndex }]);
    }

    if (userInputMode === MULTISELECT_MODE) {
      const selectedIndex = selectedUnits.findIndex(unit => unit.unitId === unitId)

      if (selectedIndex >= 0) {
        selectedUnits.splice(selectedIndex, 1);
      } else {
        if (selectedUnits.length >= MAX_MULTISELECT) {
          selectedUnits.splice(selectedUnits.length - 1, 1);
        }

        selectedUnits.push({ unitId, unitIndex })
      }

      setSelectedUnits([ ...selectedUnits ]);

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
      setTimeout(() => { alert('You Loose') }, projectileExplosionDuration + 300)
      return;
    }

    if (moves >= 0 && !someUnitsLeft) {
      setTimeout(() => {
        setWinScreenVisible(true)
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

  const onModeChange = (mode) => {
    setUserInputMode(mode);
  }

  const onConfirm = (action) => {
    if (!action) {
      return;
    }

    if (action === 'swap') {
      const newUnits = [ ...units ];

      const { unitIndex: unit0Index } = selectedUnits[0];
      const { unitIndex: unit1Index } = selectedUnits[1];

      const unit0 = structuredClone(newUnits[unit0Index]);

      newUnits[unit0Index] = newUnits[unit1Index];
      newUnits[unit1Index] = unit0;

      setUnits(newUnits);
    }

    setUserInputMode(GAMEPLAY_MODE);
    setSelectedUnits([]);
  }

  const rotateSelectedUnit = (direction) => {
    const { unitIndex } = selectedUnits[0];
    const newUnits = [ ...units ];

    const directionMultiplier = direction === 'ccv' ? -1 : 1;

    newUnits[unitIndex].angle += (45 * directionMultiplier);
    setUnits(newUnits);
  }

  const startNextLevel = () => {
    const nextLevel = currentLevel + 1;

    setCurrentLevel(nextLevel);
    setMap(mapSet[nextLevel]);
    setUnits(mapSet[nextLevel].units);

    setWinScreenVisible(false);
  }

  const getGridStyle = () => {
    const { gridWidth, gridHeight, mapWidth, mapHeight } = map;

    return {
      '--grid-width': mapWidth <= gridWidth ? gridWidth : mapWidth,
      '--grid-height': mapHeight <= gridHeight ? gridHeight : mapHeight,
    };
  }

  const getMapStyle = () => {
    const { gridWidth, gridHeight, mapWidth, mapHeight } = map;

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

      <h1>moves: {moves}</h1>
      <h2>gameplay mode: {userInputMode}</h2>
      <h3>currentLevel: {currentLevel}</h3>
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
                onClickHandler={onClick}
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
