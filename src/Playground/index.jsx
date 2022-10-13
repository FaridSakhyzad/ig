import React, {useEffect, useState} from 'react';
import Unit from '../Components/Unit/Unit';
import { UNIT_MIN_VALUE, UNIT_MAX_VALUE, MAP_WIDTH, MAP_HEIGHT } from '../Config/config';
import ProjectileLayer from '../Components/ProjectileLayer/ProjectileLayer';

const MOCK_UNITS = ((m, n) => {
  const result = [];

  for (let i = 0; i < m * n; i++) {
    result.push({
      id: Math.random().toString(16).substring(2),
      minValue: UNIT_MIN_VALUE,
      maxValue: UNIT_MAX_VALUE,
      value: 1 * (UNIT_MAX_VALUE || Math.floor(Math.random() * (UNIT_MAX_VALUE - UNIT_MIN_VALUE + 1) + UNIT_MIN_VALUE)),
      turrets: [
        {
          name: 'turret1',
          angle: 1,
        },
        {
          name: 'turret2',
          angle: 91,
        },
        {
          name: 'turret3',
          angle: 181,
        },
        {
          name: 'turret4',
          angle: 271,
        }
      ],
    });
  }

  return result;
})(MAP_WIDTH, MAP_HEIGHT)

const Playground = () => {
  const [ units, setUnits ] = useState(MOCK_UNITS);

  const [ projectiles, setProjectiles ] = useState([]);

  const [ fieldInfo, setFieldInfo ] = useState();
  const [ unitsMap, setUnitsMap ] = useState();

  const generateUnitsMap = (fieldTop, fieldLeft) => {
    return [ ...document.querySelectorAll('.unit-pivot') ].map(unit => {
      const { dataset } = unit;
      const { index } = dataset;

      const { top, left } = unit.getBoundingClientRect();

      const turretsData = [];

      const { turrets, value } = units[index];

      unit.querySelectorAll('.turret').forEach(turret => {
        const gunpoint = turret.querySelector('.gunpoint');
        const { name: turretName } = turret.dataset;
        const { top: gunpointTop, left: gunpointLeft } = gunpoint.getBoundingClientRect();

        const { angle } = turrets.find(({ name }) => (name === turretName));

        turretsData.push({
          turretName,
          gunpointTop: gunpointTop - fieldTop,
          gunpointLeft: gunpointLeft - fieldLeft,
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

  const dischargeAllTurrets = (unitIndex, unitsMap) => {
    const { turrets } = unitsMap[unitIndex];

    turrets.forEach(turret => {
      const { gunpointTop: top, gunpointLeft: left, angle } = turret;

      const id = Math.random().toString(16).substring(2);

      projectiles.push({
        id,
        top,
        left,
        angle,
      });
    })

    //console.log('Discharge All Turrets. Projectiles count: ', projectiles.length);
    setProjectiles(projectiles);
  }

  const increaseUnitValue = (unitId, unitIndex, onValueExceed) => {
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

  const onClick = (e, unitId, unitIndex) => {
    setProjectiles([]);

    increaseUnitValue(unitId, unitIndex, () => {
      dischargeAllTurrets(unitIndex, unitsMap);
    });
  }

  const onOutOfFiled = (projectileId) => {
    //console.log(`Out of field. Projectile Id: ${projectileId}. Projectiles`, projectiles);
  }

  const onImpact = (projectileId, impactedUnitId, impactedUnitIndex) => {
    console.log('impactedUnitId', impactedUnitId);
    console.log(`Impact! Projectile Id ${projectileId} Projectiles:`, projectiles);

    increaseUnitValue(impactedUnitId, impactedUnitIndex, () => {
      dischargeAllTurrets(impactedUnitIndex, unitsMap);
    });
  }



  useEffect(() => {
    document.documentElement.style.setProperty('--map-width', MAP_WIDTH);
    document.documentElement.style.setProperty('--map-height', MAP_HEIGHT);
  });

  useEffect(() => {
    const { top: fieldTop, left: fieldLeft, width: fieldWidth, height: fieldHeight } = document.querySelector('#field').getBoundingClientRect();

    if (!unitsMap) {
      setUnitsMap(generateUnitsMap(fieldTop, fieldLeft));
    }

    if (!fieldInfo) {
      setFieldInfo({ fieldTop, fieldLeft, fieldWidth, fieldHeight });
    }
  }, []);

  return (
    <div className="field" id="field">
      {unitsMap && fieldInfo && (
        <ProjectileLayer
          units={units}
          unitsMap={unitsMap}
          fieldInfo={fieldInfo}
          onOutOfFiled={onOutOfFiled}
          onImpact={onImpact}
        />
      )}

      {/*
      <div className="projectileLayer">
        {unitsMap && projectiles && projectiles.map((projectileProps) => (
          <Projectile
            key={projectileProps.id}
            units={units}
            potentialTargetsMap={makePotentialTargetsMap(projectileProps, unitsMap)}
            fieldInfo={fieldInfo}
            onOutOfFiled={onOutOfFiled}
            onImpact={onImpact}
            {...projectileProps}
          />
        ))}
      </div>
      */}
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