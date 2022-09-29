import React, { useState } from 'react';
import Projectile from '../Components/Projectile/Projectile';
import Unit from '../Components/Unit/Unit';

const PROJECTILE_SPEED = 25; //ms per pixel

const Playground = () => {
  const [ units, setUnits ] = useState([
    {
      id: Math.random().toString(16).substring(2),
      value: 1,
      turrets: [
        {
          name: 'turret1',
          angle: 35,
        },
        {
          name: 'turret2',
          angle: 112,
        },
        {
          name: 'turret3',
          angle: 195,
        },
        {
          name: 'turret4',
          angle: 280,
        }
      ],
    },
    {
      id: Math.random().toString(16).substring(2),
      value: 2,
      turrets: [
        {
          name: 'turret1',
          angle: 35,
        },
        {
          name: 'turret2',
          angle: 112,
        },
        {
          name: 'turret3',
          angle: 195,
        },
        {
          name: 'turret4',
          angle: 280,
        }
      ],
    },
    {
      id: Math.random().toString(16).substring(2),
      value: 3,
    },
    {
      id: Math.random().toString(16).substring(2),
      value: 2
    },
    {
      id: Math.random().toString(16).substring(2),
      value: 3,
      turrets: [
        {
          name: 'turret1',
          angle: 35,
        },
        {
          name: 'turret2',
          angle: 112,
        },
        {
          name: 'turret3',
          angle: 195,
        },
        {
          name: 'turret4',
          angle: 280,
        }
      ],
    },
    {
      id: Math.random().toString(16).substring(2),
      value: 4
    },
    {
      id: Math.random().toString(16).substring(2),
      value: 4
    },
    {
      id: Math.random().toString(16).substring(2),
      value: 1
    },
    {
      id: Math.random().toString(16).substring(2),
      value: 2
    },
  ]);

  const [ projectiles, setProjectiles ] = useState([]);
  const [ fieldInfo, setFieldInfo ] = useState({});
  const [ unitsMap, setUnitsMap ] = useState([]);

  const generateUnitsMap = () => {
    const { fieldTop, fieldLeft } = fieldInfo;

    return [ ...document.querySelectorAll('.unit-pivot') ].map(unit => {
      const { id } = unit;
      const { top, left } = unit.getBoundingClientRect();
      const turretsData = [];

      const { turrets } = units.find(unit => (unit.id === id));

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
        top: top - fieldTop,
        left: left - fieldLeft,
        turrets: turretsData,
      };
    })
  }

  const dischargeAllTurrets = (unitIndex) => {
    const { fieldTop, fieldLeft } = fieldInfo;

    const projectiles = [];

    unitsMap[unitIndex].turrets.forEach(turret => {
      const { gunpointTop, gunpointLeft, angle } = turret

      projectiles.push({
        id: Math.random().toString(16).substring(2),
        top: gunpointTop - fieldTop,
        left: gunpointLeft - fieldLeft,
        angle,
        parentId: unitIndex
      });
    })

    setProjectiles(projectiles);
  }

  const increaseUnitValue = (unitIndex, onValueExceed) => {
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

  const onClick = (e, unitIndex) => {
    const { top: fieldTop, left: fieldLeft, width: fieldWidth, height: fieldHeight } = document.querySelector('#field').getBoundingClientRect();

    setFieldInfo({ fieldTop, fieldLeft, fieldWidth, fieldHeight });

    setUnitsMap(generateUnitsMap());

    increaseUnitValue(unitIndex, () => {
      dischargeAllTurrets(unitIndex);
    });
  }

  const onOutOfFiled = (id) => {
    console.log('Out of field', id);
  }

  const onImpact = (projectileId, unitId) => {
    const unitIdx = units.findIndex(({ id }) => id === unitId);

    const newUnits = [ ...units ];

    newUnits[unitIdx].value += 1;

    setUnits(newUnits);
  }

  return (
    <div className="field" id="field">
      <div className="projectileLayer">
        {projectiles.map(({ id, top, left, angle, parentId }) => (
          <Projectile
            key={id}
            id={id}
            top={top}
            left={left}
            angle={angle}
            parentId={parentId}
            speed={PROJECTILE_SPEED}
            unitsMap={unitsMap}
            fieldInfo={fieldInfo}
            onOutOfFiled={onOutOfFiled}
            onImpact={onImpact}
          />
        ))}
      </div>
      <div className="unitsLayer">
        {units.map(({ turrets, value, id }, unitIndex) => (
          <Unit
            key={id}
            id={id}
            index={unitIndex}
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