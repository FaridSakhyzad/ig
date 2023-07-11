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

    const projectileToEntranceDiffAngle = Math.abs(projectileAngle - entranceAngle);

    if (projectileToEntranceDiffAngle > 90 && projectileToEntranceDiffAngle < 270) {
      const newAngle = projectileAngle + (offsetAngle - 180);
      projectileAngle = Math.abs(newAngle) < 360 ? newAngle : newAngle % 360;

      return {
        x: newX + offsetLeft,
        y: newY + offsetTop,
        angle: projectileAngle,
      }
    }

    return {
      x: newX,
      y: newY,
      angle: projectileAngle,
    }
  }

  const launchProjectileWithSetTimeout = (currentDistance = 0, currentX = 0, currentY = 0, currentAngle = angle) => {
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

      const { impactedUnit, impactWithExplodingUnit } = projectileDidImpact(left + newX, top + newY);

      if (impactedUnit && impactedUnitId !== impactedUnit.id) {
        const { id, type: impactedUnitType } = impactedUnit;

        impactedUnitId = id;

        if (projectileType === 'default') {
          if (impactedUnitType === 'default') {
            if (impactedUnit.value > 0) {
              clearTimeout(timer);
              impactedUnitId = null;
              setProjectileState('impact');

              onImpact(projectileType, impactedUnit.index, impactWithExplodingUnit);

              return;
            }
          }
          if (impactedUnitType === 'npc') {
            if (impactedUnit.value > 0) {
              clearTimeout(timer);
              impactedUnitId = null;
              setProjectileState('impact');

              onImpact(projectileType, impactedUnit.index, impactWithExplodingUnit);

              return;
            }
          }
          if (impactedUnitType === 'portal') {
            const { x, y, angle } = calculatePortalExitPointCoords(impactedUnit, newX, newY, projectileAngle);
            newX = x;
            newY = y;
            projectileAngle = angle;
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
            clearTimeout(timer);
            impactedUnitId = null;
            setProjectileState('impact');

            onImpact(projectileType, impactedUnit.index, impactWithExplodingUnit);

            return;
          }

          if (impactedUnitType === 'portal') {
            const { x, y, angle } = calculatePortalExitPointCoords(impactedUnit, newX, newY, projectileAngle);
            newX = x;
            newY = y;
            projectileAngle = angle;
          }
        }

        if (impactedUnitType === 'wall') {
          clearTimeout(timer);
          impactedUnitId = null;
          setProjectileState('impact');

          onImpact(projectileType, impactedUnit.index, impactWithExplodingUnit);

          return;
        }

        if (projectileType === 'bobomb') {
          if (impactedUnitType === 'default') {
            clearTimeout(timer);
            impactedUnitId = null;
            setProjectileState('impact');

            onImpact(projectileType, impactedUnit.index, impactWithExplodingUnit);

            return;
          }
          if (impactedUnitType === 'npc') {
            if (impactedUnit.value > 0) {
              clearTimeout(timer);
              impactedUnitId = null;
              setProjectileState('impact');

              onImpact(projectileType, impactedUnit.index, impactWithExplodingUnit);

              return;
            }
          }
          if (impactedUnitType === 'bobomb') {
            clearTimeout(timer);
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
        ref.current.style.setProperty('--angle', `${projectileAngle}deg`);
      }

      launchProjectileWithSetTimeout(currentDistance, newX, newY, projectileAngle);
    }, speed);
  };

  const launchProjectileWithRAF = () => {
    const maxDist = maxDistance || SAFE_MAX_DISTANCE * moveStep;
    const duration = speed * maxDist;

    let currentX = 0;
    let currentY = 0;
    let currentAngle = angle;

    let currentDistance = 0;
    let initialTimeStamp;

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

      const { coordinateX, coordinateY } = calculateNewCoords(currentX, currentY, currentAngle, moveStep);

      let newX = coordinateX;
      let newY = coordinateY;

      const outOfField = projectileIsOutOfField(left + newX, top + newY);

      if (outOfField) {
        setProjectileState('impact');

        onOutOfFiled(id);
        return;
      }

      const { impactedUnit, impactWithExplodingUnit } = projectileDidImpact(left + newX, top + newY);

      if (impactedUnit && impactedUnitId !== impactedUnit.id) {
        const {id, type: impactedUnitType} = impactedUnit;

        impactedUnitId = id;

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

  const projectileDidImpact = (projectilePivotX, projectilePivotY) => {
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

    return {
      impactedUnit,
      impactWithExplodingUnit
    };
  }

  useEffect(() => {
    launchProjectileWithSetTimeout();
    //launchProjectileWithRAF();
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
