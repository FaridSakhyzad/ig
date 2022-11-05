import React, {useEffect, useState} from 'react';
import Projectile from '../Components/Projectile/Projectile';
import Unit from '../Components/Unit/Unit';
import { UNIT_MIN_VALUE, UNIT_MAX_VALUE, MAP_WIDTH, MAP_HEIGHT } from '../Config/config';
import { findCircleLineIntersections } from '../utils';

const MOCK_UNITS = ((m, n) => {
  const result = [];

  for (let i = 0; i < m * n; i++) {
    result.push({
      id: Math.random().toString(16).substring(2),
      type: 'default',
      minValue: UNIT_MIN_VALUE,
      maxValue: UNIT_MAX_VALUE,
      value: Math.floor(Math.random() * (UNIT_MAX_VALUE - UNIT_MIN_VALUE + 1) + UNIT_MIN_VALUE),
      angle: 0,
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

  result[MAP_WIDTH + 3] = {
    id: Math.random().toString(16).substring(2),
    type: 'wall',
    minValue: UNIT_MIN_VALUE,
    maxValue: UNIT_MAX_VALUE,
    value: 1 * (UNIT_MAX_VALUE || Math.floor(Math.random() * (UNIT_MAX_VALUE - UNIT_MIN_VALUE + 1) + UNIT_MIN_VALUE)),
    angle: 0,
    turrets: [
      { name: 'turret1', angle: 0, type: 'default'},
      { name: 'turret2', angle: 90, type: 'default' },
      { name: 'turret3', angle: 180, type: 'default' },
      { name: 'turret4', angle: 270, type: 'default' }
    ],
  }

  result[MAP_WIDTH * 3 + 3] = {
    id: Math.random().toString(16).substring(2),
    type: 'hidden',
    minValue: UNIT_MIN_VALUE,
    maxValue: UNIT_MAX_VALUE,
    value: 1 * (UNIT_MAX_VALUE || Math.floor(Math.random() * (UNIT_MAX_VALUE - UNIT_MIN_VALUE + 1) + UNIT_MIN_VALUE)),
    angle: 0,
    turrets: [
      { name: 'turret1', angle: 0, type: 'default' },
      { name: 'turret2', angle: 90, type: 'default' },
      { name: 'turret3', angle: 180, type: 'default' },
      { name: 'turret4', angle: 270, type: 'default' }
    ],
  }

  result[MAP_WIDTH * 7 + 3] = {
    id: Math.random().toString(16).substring(2),
    type: 'laser',
    minValue: UNIT_MIN_VALUE,
    maxValue: UNIT_MAX_VALUE,
    value: 1 * (UNIT_MAX_VALUE || Math.floor(Math.random() * (UNIT_MAX_VALUE - UNIT_MIN_VALUE + 1) + UNIT_MIN_VALUE)),
    angle: 0,
    turrets: [
      { name: 'turret1', angle: 0, type: 'laser' },
      { name: 'turret2', angle: 90, type: 'laser' },
      { name: 'turret3', angle: 180, type: 'laser' },
      { name: 'turret4', angle: 270, type: 'laser' }
    ],
  }

  return result;
})(MAP_WIDTH, MAP_HEIGHT)

let unitHitBoxRadius;

const Playground = () => {
  const [ units, setUnits ] = useState(MOCK_UNITS);

  const [ projectiles, setProjectiles ] = useState([]);

  const [ fieldInfo, setFieldInfo ] = useState({});
  const [ unitsMap, setUnitsMap ] = useState([]);

  const generateUnitsMap = (fieldTop, fieldLeft) => {
    return [ ...document.querySelectorAll('.unit-pivot') ].map(unit => {
      const { dataset } = unit;
      const { index } = dataset;

      const { top, left } = unit.getBoundingClientRect();

      const turretsData = [];

      const { turrets, angle: unitAngle, value, type } = units[index];

      unit.querySelectorAll('.turret').forEach(turret => {
        const gunpoint = turret.querySelector('.gunpoint');
        const { name: turretName } = turret.dataset;
        const { top: gunpointTop, left: gunpointLeft } = gunpoint.getBoundingClientRect();

        const { angle, type } = turrets.find(({ name }) => (name === turretName));

        console.log('type', type);

        turretsData.push({
          turretName,
          gunpointTop: gunpointTop - fieldTop,
          gunpointLeft: gunpointLeft - fieldLeft,
          angle: unitAngle + angle,
          type,
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
      };
    })
  }

  const dischargeAllTurrets = (unitIndex, unitsMap) => {
    const { turrets } = unitsMap[unitIndex];

    turrets.forEach(turret => {
      const { gunpointTop: top, gunpointLeft: left, angle, type } = turret;

      const id = Math.random().toString(16).substring(2);

      projectiles.push({
        id,
        top,
        left,
        angle,
        type
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

    const { top: fieldTop, left: fieldLeft, width: fieldWidth, height: fieldHeight } = document.querySelector('#field').getBoundingClientRect();

    const fieldInfo = { fieldTop, fieldLeft, fieldWidth, fieldHeight };
    const unitsMap = generateUnitsMap(fieldTop, fieldLeft);

    setFieldInfo(fieldInfo);
    setUnitsMap(unitsMap);

    increaseUnitValue(unitId, unitIndex, () => {
      dischargeAllTurrets(unitIndex, unitsMap);
    });
  }

  const onOutOfFiled = (projectileId) => { // eslint-disable-line
    //console.log(`Out of field. Projectile Id: ${projectileId}. Projectiles`, projectiles);
  }

  const onImpact = (projectileId, impactedUnitId, impactedUnitIndex) => {
    //console.log('impactedUnitId', impactedUnitId);
    // console.log(`Impact! Projectile Id ${projectileId} Projectiles:`, projectiles);

    if (units[impactedUnitIndex].type !== 'wall') {
      increaseUnitValue(impactedUnitId, impactedUnitIndex, () => {
        dischargeAllTurrets(impactedUnitIndex, unitsMap);
      });
    }
  }

  const makePotentialTargetsMap = (projectileProps) => {
    const { parentId, angle, left: projectileX, top: projectileY } = projectileProps;

    if (angle / 90 % 2 === 0) {
      return unitsMap.filter(unit => {
        const { left: circleX } = unit;
        return Math.abs(circleX - projectileX) <= unitHitBoxRadius;
      });
    } else if (angle / 90 % 2 === 1) {
      return unitsMap.filter(unit => {
        const { top: circleY } = unit;
        return Math.abs(circleY - projectileY) <= unitHitBoxRadius;
      });
    }

    const theK = Math.tan((Math.PI / 180) * (90 + angle));
    const theB = projectileY - theK * projectileX;

    return unitsMap.filter(unit => {
      const { id, left: circleX, top: circleY } = unit;

      if (id === parentId) {
        return false;
      }

      const intersection = findCircleLineIntersections(unitHitBoxRadius, circleX, circleY, theK, theB);

      return intersection.length > 0;
    });
  }

  useEffect(() => {
    document.documentElement.style.setProperty('--map-width', MAP_WIDTH);
    document.documentElement.style.setProperty('--map-height', MAP_HEIGHT);

    unitHitBoxRadius = parseInt(getComputedStyle(document.body).getPropertyValue('--unit-hitBox--radius'));
  }, []);

  return (
    <>
      <div className="field" id="field">
        <div className="projectileLayer">
          {projectiles && projectiles.map((projectileProps) => (
            <Projectile
              key={projectileProps.id}
              units={units}
              potentialTargetsMap={makePotentialTargetsMap(projectileProps)}
              fieldInfo={fieldInfo}
              onOutOfFiled={onOutOfFiled}
              onImpact={onImpact}
              {...projectileProps}
            />
          ))}
        </div>
        <div className="unitLayer">
          {units.map(({ id, type, angle, value, maxValue, turrets }, index) => (
            <Unit
              key={id}
              id={id}
              type={type}
              angle={angle}
              value={value}
              maxValue={maxValue}
              turrets={turrets}
              onClickHandler={onClick}
              idx={index}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default Playground;