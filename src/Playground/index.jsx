import React, {useEffect, useState} from 'react';
import Projectile from '../Components/Projectile/Projectile';
import Unit from '../Components/Unit/Unit';

const UNIT_MIN_VALUE = 0;
const UNIT_MAX_VALUE = 2;
const MAP_WIDTH = 9;
const MAP_HEIGHT = 9;

const MOCK_UNITS = ((m, n) => {
  const result = [];

  for (let i = 0; i < m * n; i++) {
    result.push({
      id: Math.random().toString(16).substring(2),
      minValue: UNIT_MIN_VALUE,
      maxValue: UNIT_MAX_VALUE,
      value: UNIT_MAX_VALUE || Math.floor(Math.random() * (UNIT_MAX_VALUE - UNIT_MIN_VALUE + 1) + UNIT_MIN_VALUE),
      turrets: [
        {
          name: 'turret1',
          angle: 0,
        },
        {
          name: 'turret2',
          angle: 90,
        },
        {
          name: 'turret3',
          angle: 180,
        },
        {
          name: 'turret4',
          angle: 270,
        }
      ],
    });
  }

  return result;
})(MAP_WIDTH, MAP_HEIGHT)

const Playground = () => {
  const [ units, setUnits ] = useState(MOCK_UNITS);

  const [ projectiles, setProjectiles ] = useState([]);

  const [ fieldInfo, setFieldInfo ] = useState({});
  const [ unitsMap, setUnitsMap ] = useState([]);

  const generateUnitsMap = (fieldTop, fieldLeft) => {
    return [ ...document.querySelectorAll('.unit-pivot') ].map(unit => {
      const { id, dataset } = unit;
      const { index } = dataset;

      const { top, left } = unit.getBoundingClientRect();

      const turretsData = [];

      const { turrets, value } = units.find(unit => (unit.id === id));

      unit.querySelectorAll('.turret').forEach(turret => {
        const gunpoint = turret.querySelector('.gunpoint');
        const { name: turretName } = turret.dataset;
        const { top: gunpointTop, left: gunpointLeft } = gunpoint.getBoundingClientRect();

        const { angle } = turrets.find(({ name }) => (name === turretName));

        turretsData.push({
          turretName,
          gunpointTop,
          gunpointLeft,
          angle,
        })
      });

      return {
        id: unit.id,
        index: parseInt(index, 10),
        value,
        top: top - fieldTop,
        left: left - fieldLeft,
        turrets: turretsData,
      };
    })
  }

  const dischargeAllTurrets = (parentId, unitsMap, fieldTop, fieldLeft) => {
    const unitIndex = units.findIndex(unit => (unit.id === parentId));

    const { turrets } = unitsMap[unitIndex];

    turrets.forEach(turret => {
      const { gunpointTop, gunpointLeft, angle } = turret;

      const id = Math.random().toString(16).substring(2);

      projectiles.push({
        id,
        top: gunpointTop - fieldTop,
        left: gunpointLeft - fieldLeft,
        angle,
        parentId
      });
    })

    console.log('Discharge All Turrets. Projectiles count: ', projectiles.length);
    setProjectiles(projectiles);
  }

  const increaseUnitValue = (unitId, onValueExceed) => {
    const unitIndex = units.findIndex(unit => (unit.id === unitId));

    const newUnits = [ ...units ];
    const { value, maxValue, minValue } = newUnits[unitIndex];

    let newValue;

    if (value >= maxValue) {
      onValueExceed();
      newValue = minValue;
    } else {
      newValue = 1 + value;
    }

    newUnits[unitIndex].value = newValue;

    setUnits(newUnits);
  }

  const onClick = (e, unitId) => {
    setProjectiles([]);

    const { top: fieldTop, left: fieldLeft, width: fieldWidth, height: fieldHeight } = document.querySelector('#field').getBoundingClientRect();

    const fieldInfo = { fieldTop, fieldLeft, fieldWidth, fieldHeight };
    const unitsMap = generateUnitsMap(fieldTop, fieldLeft);

    setFieldInfo(fieldInfo);
    setUnitsMap(unitsMap);

    increaseUnitValue(unitId, () => {
      dischargeAllTurrets(unitId, unitsMap, fieldTop, fieldLeft);
    });
  }

  const onOutOfFiled = (projectileId) => {
    console.log(`Out of field. Projectile Id: ${projectileId}. Projectiles`, projectiles);
  }

  const onImpact = (projectileId, impactedUnitId) => {
    const { fieldTop, fieldLeft } = fieldInfo;

    console.log('impactedUnitId', impactedUnitId);
    console.log(`Impact! Projectile Id ${projectileId} Projectiles:`, projectiles);

    increaseUnitValue(impactedUnitId, () => {
      dischargeAllTurrets(impactedUnitId, unitsMap, fieldTop, fieldLeft);
    });
  }

  useEffect(() => {
    document.documentElement.style.setProperty('--map-width', MAP_WIDTH);
    document.documentElement.style.setProperty('--map-height', MAP_HEIGHT);
  })

  return (
    <div className="field" id="field">
      <div className="projectileLayer">
        {projectiles && projectiles.map(({ id, top, left, angle, parentId }) => (
          <Projectile
            key={id}
            id={id}
            top={top}
            left={left}
            angle={angle}
            parentId={parentId}
            units={units}
            unitsMap={unitsMap}
            fieldInfo={fieldInfo}
            onOutOfFiled={onOutOfFiled}
            onImpact={onImpact}
          />
        ))}
      </div>
      <div className="unitLayer">
        {units.map(({ turrets, value, maxValue, id }, index) => (
          <Unit
            key={id}
            id={id}
            idx={index}
            turrets={turrets}
            onClickHandler={onClick}
            value={value}
            maxValue={maxValue}
          />
        ))}
      </div>
    </div>
  )
}

export default Playground;