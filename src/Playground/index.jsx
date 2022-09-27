import React, { useState } from 'react';
import Projectile from '../Components/Projectile/Projectile';
import Unit from '../Components/Unit/Unit';

const PROJECTILE_SPEED = 50; //ms per pixel

const Playground = () => {
  const [ units, setUnits ] = useState([
    {
      value: 11,
      turrets: [
        {
          name: 'turret1',
          angle: 35,
        },
        {
          name: 'turret2',
          angle: 120,
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
    { value: 12 },
    { value: 13 },
    { value: 21 },
    { value: 22 },
    { value: 23 },
    { value: 31 },
    { value: 32 },
    { value: 33 },
  ]);

  const [ projectiles, setProjectiles ] = useState([]);
  const [ unitsMap, setUnitsInfo ] = useState([]);

  const onClick = (e, id) => {
    const { currentTarget } = e;
    const { value, turrets } = units[id];

    const { top: fieldTop, left: fieldLeft } = document.querySelector('#field').getBoundingClientRect()

    setUnitsInfo([ ...document.querySelectorAll('.unit-pivot') ].map(unit => {
      const { top, left } = unit.getBoundingClientRect();

      return {
        top: top - fieldTop,
        left: left - fieldLeft,
      };
    }));

    const projectiles = [];

    currentTarget.querySelectorAll('.turret').forEach(turret => {
      const gunpoint = turret.querySelector('.gunpoint');

      const { name: turretName } = turret.dataset;

      const { angle } = turrets.find(({ name }) => (name === turretName));

      const { top, left } = gunpoint.getBoundingClientRect();

      projectiles.push({
        top: top - fieldTop,
        left: left - fieldLeft,
        angle,
        parentId: id
      });
    })

    setProjectiles(projectiles);
  }

  return (
    <div className="field" id="field">
      <div className="projectileLayer">
        {projectiles.map(({ top, left, angle, parentId }, ixd) => (
          <Projectile
            key={ixd}
            top={top}
            left={left}
            angle={angle}
            parentId={parentId}
            speed={PROJECTILE_SPEED}
            unitsMap={unitsMap}
          />
        ))}
      </div>
      <div className="unitsLayer">
        {units.map(({ turrets }, itemIndex) => (
          <Unit
            key={itemIndex}
            id={itemIndex}
            turrets={turrets}
            onClickHandler={onClick}
          />
        ))}
      </div>
    </div>
  )
}

export default Playground;