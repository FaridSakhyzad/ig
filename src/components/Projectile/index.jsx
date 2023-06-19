import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { SAFE_MAX_DISTANCE } from '../../config/config';
import './Projectile.scss';
import { calculateNewCoords, findRectangleCircleIntersection, rotate } from '../../utils';

const Projectile = (props) => {
  const {
    id,
    top,
    left,
    angle,
    type: projectileType,
    maxDistance,
    speed,
    units,
    potentialTargetsMap,
    fieldInfo,
    onOutOfFiled,
    onImpact,
    moveStep,
  } = props;

  const [ projectileState, setProjectileState ] = useState('inFlight');

  const ref = useRef(null);

  const computedStyle = getComputedStyle(document.documentElement);

  const unitRadiusPropValue = computedStyle.getPropertyValue('--unit-hitBox--radius').replace(/calc|px/ig, '');

  const projectileWidthPropValue = computedStyle.getPropertyValue('--projectile-hitBox--width').replace(/calc|px/ig, '');
  const projectileHeightPropValue = computedStyle.getPropertyValue('--projectile-hitBox--height').replace(/calc|px/ig, '');

  const unitRadius = parseInt(eval(unitRadiusPropValue), 10);
  const projectileWidth = parseInt(eval(projectileWidthPropValue), 10);
  const projectileHeight = parseInt(eval(projectileHeightPropValue), 10);

  let impactedUnitId = null;

  const launchProjectile = (currentDistance = 0, currentX = 0, currentY = 0, currentAngle = angle) => {
    const maxDist = maxDistance || SAFE_MAX_DISTANCE;

    if (currentDistance >= maxDist) {
      impactedUnitId = null;
      setProjectileState('impact');

      onOutOfFiled(id);

      return;
    }

    const timer = setTimeout(() => {
      currentDistance += 1;
      const { coordinateX, coordinateY } = calculateNewCoords(currentX, currentY, currentAngle, moveStep);
      let newX = coordinateX;
      let newY = coordinateY;
      let projectileAngle = currentAngle;

      const outOfField = projectileIsOutOfField(left + newX, top + newY);

      if (outOfField) {
        clearTimeout(timer);
        setProjectileState('impact');

        onOutOfFiled(id);
        return;
      }

      const impactedUnit = projectileDidImpact(left + newX, top + newY);

      if (impactedUnit && impactedUnitId !== impactedUnit.id) {
        const { id, type: impactedUnitType } = impactedUnit;

        impactedUnitId = id;

        if (projectileType === 'default') {
          if (impactedUnitType === 'default') {
            if (impactedUnit.value > 0) {
              clearTimeout(timer);
              impactedUnitId = null;
              setProjectileState('impact');

              onImpact(projectileType, impactedUnit.index);
              return;
            }
          }
          if (impactedUnitType === 'portal') {
            const { top: entranceTop, left: entranceLeft, angle: entranceAngle, meta: { siblingId } } = impactedUnit;
            const { top: exitTop, left: exitLeft, angle: exitAngle } = potentialTargetsMap.find(({ id }) => id === siblingId);
            const offsetTop = exitTop - entranceTop;
            const offsetLeft = exitLeft - entranceLeft;
            const offsetAngle = exitAngle - entranceAngle;

            const projectileToEntranceDiffAngle = Math.abs(projectileAngle - entranceAngle);

            if (projectileToEntranceDiffAngle > 90 && projectileToEntranceDiffAngle < 270) {
              const newAngle = projectileAngle + (offsetAngle - 180);
              projectileAngle = Math.abs(newAngle) < 360 ? newAngle : newAngle % 360;
              newX = newX + offsetLeft;
              newY = newY + offsetTop;
            }
          }
        }

        if (projectileType === 'laser') {
          if (impactedUnitType === 'default') {
            if (impactedUnit.value > 0) {
              onImpact(projectileType, impactedUnit.index);
            }
          }

          if (impactedUnitType === 'laser') {
            clearTimeout(timer);
            impactedUnitId = null;
            setProjectileState('impact');

            onImpact(projectileType, impactedUnit.index);
            return;
          }

          if (impactedUnitType === 'portal') {
            const { top: entranceTop, left: entranceLeft, angle: entranceAngle, meta: { siblingId } } = impactedUnit;
            const { top: exitTop, left: exitLeft, angle: exitAngle } = potentialTargetsMap.find(({ id }) => id === siblingId);
            const offsetTop = exitTop - entranceTop;
            const offsetLeft = exitLeft - entranceLeft;
            const offsetAngle = exitAngle - entranceAngle;

            const projectileToEntranceDiffAngle = Math.abs(projectileAngle - entranceAngle);

            if (projectileToEntranceDiffAngle > 90 && projectileToEntranceDiffAngle < 270) {
              const newAngle = projectileAngle + (offsetAngle - 180);
              projectileAngle = Math.abs(newAngle) < 360 ? newAngle : newAngle % 360;
              newX = newX + offsetLeft;
              newY = newY + offsetTop;
            }
          }
        }

        if (impactedUnitType === 'wall') {
          clearTimeout(timer);
          impactedUnitId = null;
          setProjectileState('impact');

          onImpact(projectileType, impactedUnit.index);
          return;
        }

        if (projectileType === 'bobomb') {
          if (impactedUnitType === 'default') {
            clearTimeout(timer);
            impactedUnitId = null;
            setProjectileState('impact');

            onImpact(projectileType, impactedUnit.index);
            return;
          }
        }
      }

      ref.current.style.setProperty('--offset-x', `${newX}px`);
      ref.current.style.setProperty('--offset-y', `${newY}px`);
      ref.current.style.setProperty('--angle', `${projectileAngle}deg`);

      launchProjectile(currentDistance, newX, newY, projectileAngle);
    }, speed);
  };

  const projectileIsOutOfField = (projectilePivotX, projectilePivotY) => {
    const { fieldWidth, fieldHeight } = fieldInfo;

    const topLeftX = projectilePivotX - (projectileWidth / 2);
    const topLeftY = projectilePivotY - (projectileHeight / 2);

    const topRightX = projectilePivotX + (projectileWidth / 2);
    const topRightY = projectilePivotY + (projectileHeight / 2);

    const { nx: topLeftNewX, ny: topLeftNewY } = rotate(projectilePivotX, projectilePivotY, topLeftX, topLeftY, angle * -1);
    const { nx: topRightNewX, ny: topRightNewY } = rotate(projectilePivotX, projectilePivotY, topRightX, topRightY, angle * -1);

    const topLeftIsOut = topLeftNewX <= 0 || topLeftNewY <= 0 || topLeftNewX >= fieldWidth || topLeftNewY >= fieldHeight;
    const topRightIsOut = topRightNewX <= 0 || topRightNewY <= 0 || topRightNewX >= fieldWidth || topRightNewY >= fieldHeight;

    return topLeftIsOut || topRightIsOut;
  }

  const projectileDidImpact = (projectilePivotX, projectilePivotY) => {
    const { nx: projectileX, ny: projectileY } =
      rotate(projectilePivotX, projectilePivotY, projectilePivotX, projectilePivotY, angle * -1);

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
    launchProjectile();
  }, []);

  return (
    <div className={`projectile ${projectileType}`}
      id={id}
      ref={ref}
      style={{
        top,
        left,
        transform: `translate(var(--offset-x), var(--offset-y)) rotate(var(--angle))`
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

Projectile.propTypes = {
  id: PropTypes.string,
  top: PropTypes.number,
  left: PropTypes.number,
  type: PropTypes.string,
  maxDistance: PropTypes.number,
  speed: PropTypes.number,
  angle: PropTypes.number,
  units: PropTypes.array,
  potentialTargetsMap: PropTypes.array,
  fieldInfo: PropTypes.object,
  onOutOfFiled: PropTypes.func,
  onImpact: PropTypes.func,
  moveStep: PropTypes.number,
};

export default Projectile;
