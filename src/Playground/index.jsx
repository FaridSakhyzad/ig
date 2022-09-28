import React, { useState } from 'react';
import Projectile from '../Components/Projectile/Projectile';
import Unit from '../Components/Unit/Unit';

const PROJECTILE_SPEED = 50; //ms per pixel

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
      value: 2
    },
    {
      id: Math.random().toString(16).substring(2),
      value: 3
    },
    {
      id: Math.random().toString(16).substring(2),
      value: 2
    },
    {
      id: Math.random().toString(16).substring(2),
      value: 3
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

  const generateUnitsMap = (fieldTop, fieldLeft) => {
    return [ ...document.querySelectorAll('.unit-pivot') ].map(unit => {
      const { top, left } = unit.getBoundingClientRect();

      return {
        id: unit.id,
        top: top - fieldTop,
        left: left - fieldLeft,
      };
    })
  }

  const onClick = (e, id) => {
    const { currentTarget } = e;
    const { turrets } = units[id];

    const { top: fieldTop, left: fieldLeft, width: fieldWidth, height: fieldHeight } = document.querySelector('#field').getBoundingClientRect();

    setFieldInfo({ fieldWidth, fieldHeight });

    setUnitsMap(generateUnitsMap(fieldTop, fieldLeft));

    const projectiles = [];

    currentTarget.querySelectorAll('.turret').forEach(turret => {
      const gunpoint = turret.querySelector('.gunpoint');

      const { name: turretName } = turret.dataset;

      const { angle } = turrets.find(({ name }) => (name === turretName));

      const { top, left } = gunpoint.getBoundingClientRect();

      projectiles.push({
        id: Math.random().toString(16).substring(2),
        top: top - fieldTop,
        left: left - fieldLeft,
        angle,
        parentId: id
      });
    })

    setProjectiles(projectiles);
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
        {units.map(({ turrets, value, id }, itemIndex) => (
          <Unit
            key={id}
            id={id}
            index={itemIndex}
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