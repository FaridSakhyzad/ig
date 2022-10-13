import React, { useEffect, useState } from 'react';
import Projectile from '../Projectile/Projectile';
import {findCircleLineIntersections} from '../../utils';

const ProjectileLayer = ({ units, unitsMap, fieldInfo, onOutOfFiled, onImpact }) => {
  const [ projectileMap, setProjectileMap ] = useState([]);

  const makePotentialTargetsMap = (projectileProps, unitsMap) => {
    const { id: parentId, angle, left: projectileLeft, top: projectileTop } = projectileProps;

    const theK = Math.tan((Math.PI / 180) * (90 + angle));
    const theB = projectileTop - theK * projectileLeft;

    return unitsMap.filter(unit => {
      const { id, left: circleX, top: circleY } = unit;

      if (id === parentId) {
        return false;
      }

      const intersection = findCircleLineIntersections(12, circleX, circleY, theK, theB);

      return intersection.length > 0;
    });
  }

  const generateProjectilesMap = (unitsMap) => {
    const result = [];

    const { top: fieldTop, left: fieldLeft } = document.querySelector('#field').getBoundingClientRect();

    [ ...document.querySelectorAll('.unit-pivot') ].forEach(unit => {
      const { id: parentId, dataset } = unit;
      const { index } = dataset;
      const { turrets } = units[index];

      unit.querySelectorAll('.turret').forEach(turret => {
        const gunpoint = turret.querySelector('.gunpoint');
        const { index: turretIndex } = turret.dataset;

        const { top: gunpointTop, left: gunpointLeft } = gunpoint.getBoundingClientRect();

        const { angle } = turrets[turretIndex];

        const id = Math.random().toString(16).substring(2);

        const top = gunpointTop - fieldTop;
        const left = gunpointLeft - fieldLeft;

        result.push({
          id,
          parentId,
          top,
          left,
          potentialTargetsMap: makePotentialTargetsMap({ id, top, left, angle }, unitsMap),
          angle,
        })
      });
    });

    return result;
  }

  useEffect(() => {
    if (!projectileMap.length) {
      setProjectileMap(generateProjectilesMap(unitsMap));
    }
  }, []);

  return (
    <div className="projectileLayer">
      {projectileMap.map(({ id, top, left, angle, potentialTargetsMap }) => (
        <Projectile
          key={id}
          id={id}
          top={top}
          left={left}
          angle={angle}
          potentialTargetsMap={potentialTargetsMap}
          units={units}
          fieldInfo={fieldInfo}
          onOutOfFiled={onOutOfFiled}
          onImpact={onImpact}
        />
      ))}
    </div>
  )
};

export default ProjectileLayer;