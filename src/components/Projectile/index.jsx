import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { SAFE_MAX_DISTANCE } from '../../config/config';
import './Projectile.scss';
import {calculateNewCoords, findRectangleCircleIntersection, rotate} from '../../utils';

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

  const baseWidthUnit = parseFloat(eval(computedStyle.getPropertyValue('--base-width-unit')), 10);

  const projectileWidthPropValue = computedStyle.getPropertyValue('--projectile-hitBox--width').replace(/calc|px/ig, '');
  const projectileHeightPropValue = computedStyle.getPropertyValue('--projectile-hitBox--height').replace(/calc|px/ig, '');

  const projectileWidth = parseFloat(eval(projectileWidthPropValue), 10);
  const projectileHeight = parseFloat(eval(projectileHeightPropValue), 10);

  let impactedUnitId = null;

  const calculatePortalExitPointCoords = (impactedUnit, newX, newY, projectileAngle) => {
    const { top: entranceTop, left: entranceLeft, angle: entranceAngle, meta: { exitPortalId } } = impactedUnit;

    const target = potentialTargetsMap.find(({ id }) => id === exitPortalId)

    if (!target) {
      return {
        x: newX,
        y: newY,
        angle: projectileAngle,
      }
    }

    const { top: exitTop, left: exitLeft, angle: exitAngle } = target;
    const offsetTop = exitTop - entranceTop;
    const offsetLeft = exitLeft - entranceLeft;
    const offsetAngle = exitAngle - entranceAngle;

    const fromEntranceTopToOrigin = entranceTop - top;
    const fromEntranceLeftToOrigin = entranceLeft - left;

    const correctionX = fromEntranceLeftToOrigin - newX;
    const correctionY = fromEntranceTopToOrigin - newY;

    const projectileToEntranceDiffAngle = Math.abs(projectileAngle - entranceAngle);

    if (projectileToEntranceDiffAngle > 90 && projectileToEntranceDiffAngle < 270) {
      const newAngle = projectileAngle + (offsetAngle - 180);
      projectileAngle = Math.abs(newAngle) < 360 ? newAngle : newAngle % 360;

      return {
        x: newX + correctionX + offsetLeft,
        y: newY + correctionY + offsetTop,
        angle: projectileAngle,
      }
    }

    return {
      x: newX,
      y: newY,
      angle: projectileAngle,
    }
  }

  const calculateDeflectedCoords = (impactedUnit, newX, newY, projectileAngle) => {
    const { top: entranceTop, left: entranceLeft, angle } = impactedUnit;

    const projectileToUnitDiffAngle = Math.abs(projectileAngle - angle);

    const angleToNormal = projectileToUnitDiffAngle % 180;

    const fromEntranceTopToOrigin = entranceTop - top;
    const fromEntranceLeftToOrigin = entranceLeft - left;

    const correctionX = fromEntranceLeftToOrigin - newX;
    const correctionY = fromEntranceTopToOrigin - newY;

    return {
      x: newX + correctionX,
      y: newY + correctionY,
      angle: angleToNormal === 90 ? projectileAngle + 180 : projectileAngle + ((90 - angleToNormal) * 2),
    }
  }

  const calculateTeleportedCoords = (impactedUnit, newX, newY, projectileAngle) => {
    const { top: entranceTop, left: entranceLeft, meta: { exitTeleportId } } = impactedUnit;

    const target = potentialTargetsMap.find(({ id }) => id === exitTeleportId)

    if (!target) {
      return {
        x: newX,
        y: newY,
        angle: projectileAngle,
      }
    }

    const { id, top: exitTop, left: exitLeft } = target;
    const offsetTop = exitTop - entranceTop;
    const offsetLeft = exitLeft - entranceLeft;

    const fromEntranceTopToOrigin = entranceTop - top;
    const fromEntranceLeftToOrigin = entranceLeft - left;

    const correctionX = fromEntranceLeftToOrigin - newX;
    const correctionY = fromEntranceTopToOrigin - newY;

    return {
      exitTeleportId,
      x: newX + correctionX + offsetLeft,
      y: newY + correctionY + offsetTop,
      angle: projectileAngle,
    }
  }

  const launchProjectileWithRAF = () => {
    const maxDist = (maxDistance || SAFE_MAX_DISTANCE) * moveStep;
    const duration = speed * (maxDistance || SAFE_MAX_DISTANCE);

    let currentX = 0;
    let currentY = 0;
    let currentAngle = angle;

    let currentDistance = 0;
    let initialTimeStamp;

    let unitOfOriginId = props.unitOfOriginId;

    const animate = (timeStamp) => {
      if (currentDistance >= maxDist) {
        impactedUnitId = null;
        setProjectileState('impact');

        onOutOfFiled(id);

        return;
      }

      if (!initialTimeStamp) {
        initialTimeStamp = timeStamp;
      }

      const deltaTimeStamp = timeStamp - initialTimeStamp;

      const animationPercent = 100 / duration * deltaTimeStamp;

      initialTimeStamp = timeStamp;

      currentDistance = currentDistance + (maxDist * animationPercent / 100);

      const { coordinateX, coordinateY } = calculateNewCoords(currentX, currentY, currentAngle, (maxDist * animationPercent / 100));

      let newX = coordinateX;
      let newY = coordinateY;

      const outOfField = projectileIsOutOfField(left + newX, top + newY);

      if (outOfField) {
        setProjectileState('impact');

        onOutOfFiled(id);
        return;
      }

      const { impactedUnit, impactWithExplodingUnit } = projectileDidImpact(left + newX, top + newY, currentAngle);

      if (impactedUnit && impactedUnitId !== impactedUnit.id && unitOfOriginId !== impactedUnit.id) {
        const {id, type: impactedUnitType} = impactedUnit;

        impactedUnitId = id;
        unitOfOriginId = id;

        if (projectileType === 'default') {
          if (impactedUnitType === 'default') {
            if (impactedUnit.value > 0) {
              impactedUnitId = null;
              setProjectileState('impact');

              onImpact(projectileType, impactedUnit.index, impactWithExplodingUnit);

              return;
            }
          }
          if (impactedUnitType === 'npc') {
            if (impactedUnit.value > 0) {
              impactedUnitId = null;
              setProjectileState('impact');

              onImpact(projectileType, impactedUnit.index, impactWithExplodingUnit);

              return;
            }
          }
          if (impactedUnitType === 'portal') {
            const { x, y, angle } = calculatePortalExitPointCoords(impactedUnit, newX, newY, currentAngle);
            newX = x;
            newY = y;
            currentAngle = angle;
          }

          if (impactedUnitType === 'deflector') {
            const { x, y, angle } = calculateDeflectedCoords(impactedUnit, newX, newY, currentAngle);
            unitOfOriginId = impactedUnit.id;

            newX = x;
            newY = y;
            currentAngle = angle;
          }

          if (impactedUnitType === 'teleport') {
            const { x, y, angle, exitTeleportId } = calculateTeleportedCoords(impactedUnit, newX, newY, currentAngle);
            unitOfOriginId = exitTeleportId;

            newX = x;
            newY = y;
            currentAngle = angle;
          }
        }

        if (projectileType === 'laser') {
          if (impactedUnitType === 'default') {
            if (impactedUnit.value > 0) {
              onImpact(projectileType, impactedUnit.index, impactWithExplodingUnit);
            }
          }

          if (impactedUnitType === 'npc') {
            if (impactedUnit.value > 0) {
              onImpact(projectileType, impactedUnit.index, impactWithExplodingUnit);
            }
          }

          if (impactedUnitType === 'laser') {
            impactedUnitId = null;
            setProjectileState('impact');

            onImpact(projectileType, impactedUnit.index, impactWithExplodingUnit);

            return;
          }

          if (impactedUnitType === 'portal') {
            const { x, y, angle } = calculatePortalExitPointCoords(impactedUnit, newX, newY, currentAngle);
            newX = x;
            newY = y;
            currentAngle = angle;
          }
        }

        if (impactedUnitType === 'wall') {
          impactedUnitId = null;
          setProjectileState('impact');

          onImpact(projectileType, impactedUnit.index, impactWithExplodingUnit);

          return;
        }

        if (projectileType === 'bobomb') {
          if (impactedUnitType === 'default') {
            impactedUnitId = null;
            setProjectileState('impact');

            onImpact(projectileType, impactedUnit.index, impactWithExplodingUnit);

            return;
          }
          if (impactedUnitType === 'npc') {
            if (impactedUnit.value > 0) {
              impactedUnitId = null;
              setProjectileState('impact');

              onImpact(projectileType, impactedUnit.index, impactWithExplodingUnit);

              return;
            }
          }
          if (impactedUnitType === 'bobomb') {
            impactedUnitId = null;
            setProjectileState('impact');

            onImpact(projectileType, impactedUnit.index, impactWithExplodingUnit);

            return;
          }
        }
      }

      if (ref.current) {
        ref.current.style.setProperty('--offset-x', `${newX}px`);
        ref.current.style.setProperty('--offset-y', `${newY}px`);
        ref.current.style.setProperty('--angle', `${currentAngle}deg`);
      }

      currentX = newX;
      currentY = newY;

      window.requestAnimationFrame(animate);
    };

    window.requestAnimationFrame(animate);
  }

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

  const projectileDidImpact = (projectilePivotX, projectilePivotY, angle) => {
    const { nx: projectileX, ny: projectileY } =
      rotate(projectilePivotX, projectilePivotY, projectilePivotX, projectilePivotY, angle * -1);

    let impactedUnit = null;
    let impactWithExplodingUnit = false;

    for (let i = 0; i < potentialTargetsMap.length; ++i) {
      const potentialTarget = potentialTargetsMap[i];

      const { value, explosionStart } = units[potentialTarget.index];

      impactWithExplodingUnit = explosionStart !== undefined && ((+Date.now() - explosionStart) < 300);

      if (value === 0 && !impactWithExplodingUnit) {
        continue;
      }

      const { top: centerY, left: centerX, hitBoxRadius } = potentialTarget;

      const rectangle = {
        rectangleX: projectileX,
        rectangleY: projectileY,
        rectangleWidth: projectileWidth,
        rectangleHeight: projectileHeight,
        angle,
      };

      const circle = {
        circleX: centerX,
        circleY: centerY,
        radius: hitBoxRadius * baseWidthUnit
      };

      if (findRectangleCircleIntersection(rectangle, circle)) {
        impactedUnit = potentialTarget;
        break;
      }
    }

    return {
      impactedUnit,
      impactWithExplodingUnit
    };
  }

  useEffect(() => {
    launchProjectileWithRAF();
  }, []);

  return (
    <div className={`projectile ${projectileType}`}
      id={id}
      ref={ref}
      style={{
        top,
        left,
        transform: `translate3d(var(--offset-x), var(--offset-y), 0) rotate(var(--angle))`
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
  unitOfOriginId: PropTypes.string,
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
