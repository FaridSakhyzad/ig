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
      value: 0 * Math.pow(Math.floor(Math.random() * (UNIT_MAX_VALUE - UNIT_MIN_VALUE + 1) + UNIT_MIN_VALUE), 0),
      angle: 0,
      turrets: [
        { name: 'turret1', angle: 0, type: 'default' },
        { name: 'turret2', angle: 90, type: 'default' },
        { name: 'turret3', angle: 180, type: 'default' },
        { name: 'turret4', angle: 270, type: 'default' }
      ],
    });
  }

  result[MAP_WIDTH * 1 + 3] = {
    id: Math.random().toString(16).substring(2),
    type: 'wall',
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

  result[MAP_WIDTH * 1 + 4] = {
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

  result[MAP_WIDTH * 2 + 2] = {
    id: Math.random().toString(16).substring(2),
    type: 'bobomb',
    minValue: UNIT_MIN_VALUE,
    maxValue: UNIT_MAX_VALUE,
    value: 1 * (UNIT_MAX_VALUE || Math.floor(Math.random() * (UNIT_MAX_VALUE - UNIT_MIN_VALUE + 1) + UNIT_MIN_VALUE)),
    angle: 0,
    turrets: [
      { name: 'turret1', angle: 0, type: 'bobomb', maxDistance: 34 },
      { name: 'turret2', angle: 45, type: 'bobomb', maxDistance: Math.abs(34 / Math.cos(45 * Math.PI / 180)) },
      { name: 'turret3', angle: 90, type: 'bobomb', maxDistance: 34 },
      { name: 'turret4', angle: 135, type: 'bobomb', maxDistance: Math.abs(34 / Math.cos(135 * Math.PI / 180)) },
      { name: 'turret5', angle: 180, type: 'bobomb', maxDistance: 34 },
      { name: 'turret6', angle: 225, type: 'bobomb', maxDistance: Math.abs(34 / Math.cos(225 * Math.PI / 180)) },
      { name: 'turret7', angle: 270, type: 'bobomb', maxDistance: 34 },
      { name: 'turret8', angle: 315, type: 'bobomb', maxDistance: Math.abs(34 / Math.cos(315 * Math.PI / 180)) }
    ],
  }


  result[MAP_WIDTH * 3 + 3] = {
    id: Math.random().toString(16).substring(2),
    type: 'default',
    minValue: UNIT_MIN_VALUE,
    maxValue: UNIT_MAX_VALUE,
    value: 1,
    angle: 0,
    turrets: [
      { name: 'turret1', angle: 0, type: 'default' },
      { name: 'turret2', angle: 90, type: 'default' },
      { name: 'turret3', angle: 180, type: 'default' },
      { name: 'turret4', angle: 270, type: 'default' }
    ],
  }

  result[MAP_WIDTH * 3 + 5] = {
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

  result[MAP_WIDTH * 4 + 3] = {
    id: Math.random().toString(16).substring(2),
    type: 'default',
    minValue: UNIT_MIN_VALUE,
    maxValue: UNIT_MAX_VALUE,
    value: 1,
    angle: 0,
    turrets: [
      { name: 'turret1', angle: 0, type: 'default' },
      { name: 'turret2', angle: 90, type: 'default' },
      { name: 'turret3', angle: 180, type: 'default' },
      { name: 'turret4', angle: 270, type: 'default' }
    ],
  }

  result[MAP_WIDTH * 4 + 5] = {
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

  result[MAP_WIDTH * MAP_HEIGHT - MAP_WIDTH] = {
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

        const { angle, type, maxDistance } = turrets.find(({ name }) => (name === turretName));

        turretsData.push({
          turretName,
          gunpointTop: gunpointTop - fieldTop,
          gunpointLeft: gunpointLeft - fieldLeft,
          angle: unitAngle + angle,
          type,
          maxDistance,
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
      const { gunpointTop: top, gunpointLeft: left, angle, type, maxDistance } = turret;

      const id = Math.random().toString(16).substring(2);

      projectiles.push({
        id,
        top,
        left,
        angle,
        type,
        maxDistance,
      });
    })

    setProjectiles(projectiles);
  }

  const setUnitValue = (unitIndex, newValue, onValueExceed) => {
    const newUnits = [ ...units ];
    const { maxValue, minValue } = newUnits[unitIndex];

    if (newValue > maxValue) {
      onValueExceed();
      newUnits[unitIndex].value = minValue;
    } else {
      newUnits[unitIndex].value = newValue;
    }

    setUnits(newUnits);
  }

  const onClick = (e, unitId, unitIndex) => {
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
        });
      },
      wall: () => {},
      hidden: () => {
        setUnitValue(unitIndex, newValue, () => {
          dischargeAllTurrets(unitIndex, unitsMap);
        });
      },
      laser: () => {
        setUnitValue(unitIndex, newValue, () => {
          dischargeAllTurrets(unitIndex, unitsMap);
        });
      },
      bobomb: () => {
        setUnitValue(unitIndex, newValue, () => {
          dischargeAllTurrets(unitIndex, unitsMap);
        });
      },
    }

    callbacks[units[unitIndex].type]();
  }

  const onOutOfFiled = () => { // eslint-disable-line
    //console.log(`Out of field. Projectile Id: ${projectileId}. Projectiles`, projectiles);
  }

  const onImpact = (projectileType, impactedUnitId, impactedUnitIndex) => {
    const callbacks = {
      default: () => {
        if (projectileType === 'default') {
          setUnitValue(impactedUnitIndex, units[impactedUnitIndex].value + 1, () => {
            dischargeAllTurrets(impactedUnitIndex, unitsMap);
          });
        }

        if (projectileType === 'laser') {
          setUnitValue(impactedUnitIndex, UNIT_MAX_VALUE + 1, () => {
            dischargeAllTurrets(impactedUnitIndex, unitsMap);
          });
        }

        if (projectileType === 'bobomb') {
          setUnitValue(impactedUnitIndex, UNIT_MAX_VALUE + 1, () => {
            dischargeAllTurrets(impactedUnitIndex, unitsMap);
          });
        }
      },
      wall: () => {},
      laser: () => {
        setUnitValue(impactedUnitIndex, units[impactedUnitIndex].value + 1, () => {
          dischargeAllTurrets(impactedUnitIndex, unitsMap);
        });
      },
      bobomb: () => {
        setUnitValue(impactedUnitIndex, UNIT_MAX_VALUE + 1, () => {
          dischargeAllTurrets(impactedUnitIndex, unitsMap);
        });
      },
    }

    callbacks[units[impactedUnitIndex].type]();
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