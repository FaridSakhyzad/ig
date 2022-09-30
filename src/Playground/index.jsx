import React, {useEffect, useRef, useState} from 'react';
import Projectile from '../Components/Projectile/Projectile';
import Unit from '../Components/Unit/Unit';

const PROJECTILE_SPEED = 50; //ms per pixel

const Playground = () => {
  const [ units, setUnits ] = useState([
    {
      id: Math.random().toString(16).substring(2),
      value: 4,
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
    },
    {
      id: Math.random().toString(16).substring(2),
      value: 4,
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
    },
    {
      id: Math.random().toString(16).substring(2),
      value: 4,
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
    },
    {
      id: Math.random().toString(16).substring(2),
      value: 2,
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
    },
    {
      id: Math.random().toString(16).substring(2),
      value: 0,
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
    },
    {
      id: Math.random().toString(16).substring(2),
      value: 4,
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
    },
    {
      id: Math.random().toString(16).substring(2),
      value: 4,
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
    },
    {
      id: Math.random().toString(16).substring(2),
      value: 1,
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
    },
    {
      id: Math.random().toString(16).substring(2),
      value: 2,
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
    },
  ]);

  const [ projectiles, setProjectiles ] = useState(new Map());

  const [ fieldInfo, setFieldInfo ] = useState({});
  const [ unitsMap, setUnitsMap ] = useState([]);

  const generateUnitsMap = (fieldTop, fieldLeft) => {
    return [ ...document.querySelectorAll('.unit-pivot') ].map(unit => {
      const { id } = unit;
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
        value,
        top: top - fieldTop,
        left: left - fieldLeft,
        turrets: turretsData,
      };
    })
  }

  const dischargeAllTurrets = (unitId, unitsMap, fieldTop, fieldLeft) => {
    const unitIndex = units.findIndex(unit => (unit.id === unitId));

    const { turrets } = unitsMap[unitIndex];

    turrets.forEach(turret => {
      const { gunpointTop, gunpointLeft, angle } = turret;

      const id = Math.random().toString(16).substring(2);

      projectiles.set(id, {
        id,
        top: gunpointTop - fieldTop,
        left: gunpointLeft - fieldLeft,
        angle,
        parentId: unitId
      })
    })

    setProjectiles(new Map(projectiles));
  }

  const increaseUnitValue = (unitId, onValueExceed) => {
    const unitIndex = units.findIndex(unit => (unit.id === unitId));

    const newUnits = [ ...units ];
    const { value } = newUnits[unitIndex];

    let newValue;

    if (value >= 4) {
      onValueExceed();
      newValue = 0;
    } else {
      newValue = 1 + value;
    }

    newUnits[unitIndex].value = newValue;

    setUnits(newUnits);
  }

  const onClick = (e, unitId) => {
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
    projectiles.delete(projectileId);
    setProjectiles(new Map(projectiles));

    console.log('Out of field projectiles', projectiles);
  }

  const onImpact = (projectileId, impactedUnitId) => {
    projectiles.delete(projectileId);
    setProjectiles(new Map(projectiles));

    const { fieldTop, fieldLeft } = fieldInfo;

    increaseUnitValue(impactedUnitId, () => {
      dischargeAllTurrets(impactedUnitId, unitsMap, fieldTop, fieldLeft);
    });

    console.log('impactedUnitId', impactedUnitId);
    console.log('Impact projectiles', projectiles);
  }

  return (
    <div className="field" id="field">
      {(projectiles.size > 0) && (
        <div className="projectileLayer">
          {[...projectiles].map(item => item[1]).map(({ id, top, left, angle, parentId }) => (
            <Projectile
              key={id}
              id={id}
              top={top}
              left={left}
              angle={angle}
              parentId={parentId}
              speed={PROJECTILE_SPEED}
              units={units}
              unitsMap={unitsMap}
              fieldInfo={fieldInfo}
              onOutOfFiled={onOutOfFiled}
              onImpact={onImpact}
            />
          ))}
        </div>
      )}
      <div className="unitsLayer">
        {units.map(({ turrets, value, id }, unitIndex) => (
          <Unit
            key={id}
            id={id}
            turrets={turrets}
            onClickHandler={onClick}
            value={value}
          />
        ))}
      </div>
    </div>
  )
}

export default Playground;