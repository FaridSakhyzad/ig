import React, { useEffect, useState, useRef } from 'react';
import { PROJECTILE_MOVE_DELAY, MAX_DISTANCE } from '../../Config/config';
import { rotate, findRectangleCircleIntersection, projectileIsOutOfField } from '../../utils';

const Projectile = (props) => {
  const {
    id,
    top,
    left,
    angle,
    units,
    potentialTargetsMap,
    fieldInfo,
    onOutOfFiled,
    onImpact,
  } = props;

  const [ projectileState, setProjectileState ] = useState('inFlight');
  const projectileStateRef = useRef(projectileState);
  projectileStateRef.current = projectileState;

  const ref = useRef(null);

  const computedStyle = getComputedStyle(document.documentElement);

  const unitRadius = parseInt(computedStyle.getPropertyValue('--unit-hitBox--radius'), 10);
  const projectileWidth = parseInt(computedStyle.getPropertyValue('--projectile-hitBox--width'), 10);
  const projectileHeight = parseInt(computedStyle.getPropertyValue('--projectile-hitBox--height'), 10);

  const launchProjectile = (maxDistance, currentDistance = 0) => {
    if (currentDistance >= maxDistance) {
      console.log('Stopped by Steps Limit', id);
      return;
    }

    const timer = setTimeout(() => {
      currentDistance += 1;

      const outOfField = projectileIsOutOfField(currentDistance, left, top, projectileWidth, projectileHeight, angle, fieldInfo.fieldWidth, fieldInfo.fieldHeight);

      if (outOfField) {
        onOutOfFiled(id);

        //console.log('clearTimeout');
        clearTimeout(timer);

        setProjectileState('impact');
        return;
      }

      const impactedUnit = projectileDidImpact(currentDistance);

      if (impactedUnit && impactedUnit.value > 0) {
        onImpact(id, impactedUnit.id, impactedUnit.index);

        //console.log('clearTimeout');
        clearTimeout(timer);

        setProjectileState('impact');
        return;
      }

      ref.current.style.setProperty('--distance', `${-1 * currentDistance}px`);
      launchProjectile(maxDistance, currentDistance);
    }, PROJECTILE_MOVE_DELAY);
  };

  const projectileDidImpact = (distance) => {
    const projectilePivotX = left;
    const projectilePivotY = top;

    const { nx: projectileX, ny: projectileY } =
      rotate(projectilePivotX, projectilePivotY, projectilePivotX, projectilePivotY - distance, angle * -1);

    let impactedUnit = null;

    for (let i = 0; i < potentialTargetsMap.length; ++i) {
      const potentialTarget = potentialTargetsMap[i];

      const { value } = units[potentialTarget.index];

      if (value === 0) {
        continue;
      }

      const { top: circleY, left: circleX } = potentialTarget;

      const rectangle = {
        rectangleX: projectileX,
        rectangleY: projectileY,
        rectangleWidth: projectileWidth,
        rectangleHeight: projectileHeight,
        angle,
      };

      const circle = {
        circleX: circleX,
        circleY: circleY,
        radius: unitRadius
      };

      if (findRectangleCircleIntersection(rectangle, circle)) {
        impactedUnit = potentialTarget;
        break;
      }
    }

    return impactedUnit;
  }

  useEffect(() => {
    launchProjectile(MAX_DISTANCE);
  }, []);

  return (
    <div className="projectile"
      id={id}
      ref={ref}
      style={{
        top,
        left,
        transform: `rotate(${angle}deg) translateY(var(--distance))`
      }}
    >
      <div className="projectile-hitBox" />
      {projectileState === 'inFlight' && (
        <div className="projectile-image" />
      )}

      {projectileState === 'impact' && (
        <div className="projectile-explosion" />
      )}
    </div>
  )
}

export default Projectile;