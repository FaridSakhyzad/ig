import React, {useEffect, useState} from 'react';
import Projectile from '../Components/Projectile/Projectile';
import Unit from '../Components/Unit/Unit';
import { UNIT_MIN_VALUE, UNIT_MAX_VALUE, MAP_WIDTH, MAP_HEIGHT } from '../Config/config';

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

    const { top: fieldTop, left: fieldLeft, width: fieldWidth, height: fieldHeight } = document.querySelector('#field').getBoundingClientRect();

    const fieldInfo = { fieldTop, fieldLeft, fieldWidth, fieldHeight };
    const unitsMap = generateUnitsMap(fieldTop, fieldLeft);

    setFieldInfo(fieldInfo);
    setUnitsMap(unitsMap);

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

  function findCircleLineIntersections(circleRadius, circleX, circleY, m, n) {
    // circle: (x - h)^2 + (y - k)^2 = r^2
    // line: y = m * x + n
    // r: circle radius
    // h: x value of circle centre
    // k: y value of circle centre
    // m: slope
    // n: y-intercept

    // get a, b, c values
    const a = 1 + Math.pow(m, 2);
    const b = -circleX * 2 + (m * (n - circleY)) * 2;
    const c = Math.pow(circleX, 2) + Math.pow(n - circleY, 2) - Math.pow(circleRadius, 2);

    // get discriminant
    const D = Math.pow(b, 2) - 4 * a * c;

    if (D >= 0) {
      // insert into quadratic formula
      var intersections = [
        (-b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a),
        (-b - Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a)
      ];
      if (D === 0) {
        // only 1 intersection
        return [intersections[0]];
      }
      return intersections;
    }
    // no intersection
    return [];
  }

  function doesLineInterceptCircle(A, B, C, radius) {
    var dist;
    const v1x = B.x - A.x;
    const v1y = B.y - A.y;
    const v2x = C.x - A.x;
    const v2y = C.y - A.y;
    // get the unit distance along the line of the closest point to
    // circle center
    const u = (v2x * v1x + v2y * v1y) / (v1y * v1y + v1x * v1x);


    // if the point is on the line segment get the distance squared
    // from that point to the circle center
    if(u >= 0 && u <= 1){
      dist  = (A.x + v1x * u - C.x) ** 2 + (A.y + v1y * u - C.y) ** 2;
    } else {
      // if closest point not on the line segment
      // use the unit distance to determine which end is closest
      // and get dist square to circle
      dist = u < 0 ?
        (A.x - C.x) ** 2 + (A.y - C.y) ** 2 :
        (B.x - C.x) ** 2 + (B.y - C.y) ** 2;
    }
    return dist < radius * radius;
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

    console.log('unitHitBoxRadius', unitHitBoxRadius);
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
    </>
  )
}

export default Playground;