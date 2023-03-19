import React, {useEffect, useState} from 'react';
import Projectile from '../Projectile';
import Unit from '../Unit';
import './Playground.scss';
import { UNIT_MAX_VALUE, MAP_WIDTH, MAP_HEIGHT } from '../../config/config';
import { MULTISELECT_MODE, GAMEPLAY_MODE, SELECT_MODE } from '../../constants/constants';

import MOCK_UNITS from '../../maps/mockUnits';
import UserMenu from '../UserMenu';

const MAX_MULTISELECT = 2;

const Playground = () => {
  const [ userInputMode, setUserInputMode ] = useState(GAMEPLAY_MODE);

  const [ units, setUnits ] = useState(MOCK_UNITS);
  const [ selectedUnits, setSelectedUnits ] = useState([]);

  const [ projectiles, setProjectiles ] = useState([]);

  const [ fieldInfo, setFieldInfo ] = useState({});
  const [ unitsMap, setUnitsMap ] = useState([]);

  const [ moves, setMoves ] = useState(1000);

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
      newValue = UNIT_MAX_VALUE;
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

    const unitsLeft = units.some((unit) => unit.valueCountable && unit.value > 0);

    if (moves < 1 && unitsLeft) {
      setTimeout(() => { alert('You Loose') }, Playground.projectileExplosionDuration + 300)
      return;
    }

    if (moves > 0 && !unitsLeft) {
      setTimeout(() => { alert('You win') }, Playground.projectileExplosionDuration + 300);
    }
  }

  const onOutOfFiled = () => {
    --Playground.actingProjectilesNumber;

    detectGameOutcome();
  }

  const onImpact = (projectileType, impactedUnitIndex) => {
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
          setUnitValue(impactedUnitIndex, UNIT_MAX_VALUE + 1, () => {
            dischargeAllTurrets(impactedUnitIndex, unitsMap);
            explodeUnit(impactedUnitIndex);
          });
        }

        if (projectileType === 'bobomb') {
          --Playground.actingProjectilesNumber;

          setUnitValue(impactedUnitIndex, UNIT_MAX_VALUE + 1, () => {
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

        setUnitValue(impactedUnitIndex, UNIT_MAX_VALUE + 1, () => {
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

  useEffect(() => {
    document.documentElement.style.setProperty('--map-width', MAP_WIDTH);
    document.documentElement.style.setProperty('--map-height', MAP_HEIGHT);

    const computedStyle = getComputedStyle(document.documentElement);

    Playground.projectileExplosionDuration = parseFloat(computedStyle.getPropertyValue('--projectile-explosion--duration')) * 1000;
  }, []);

  return (
    <>
      <h1>moves: {moves}</h1>
      <h2>gameplay mode {userInputMode}</h2>
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
              moveStep={Playground.projectileMoveStep}
              {...projectileProps}
            />
          ))}
        </div>
        <div className="unitLayer">
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

      <UserMenu
        userInputMode={userInputMode}
        onModeChange={onModeChange}
        onRotate={rotateSelectedUnit}
        onConfirm={onConfirm}
      />
    </>
  )
}

Playground.projectileMoveStep = 1;
Playground.projectileExplosionDuration = 0;
Playground.actingProjectilesNumber = 0;

export default Playground;
