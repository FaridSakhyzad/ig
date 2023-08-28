import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { SAFE_MAX_DISTANCE } from '../../config/config';
import './Projectile.scss';
import { calcNewCoords, findRectangleCircleIntersection, rotate } from '../../utils';

function Projectile(props) {
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

  const [projectileState, setProjectileState] = useState('inFlight');

  const ref = useRef(null);

  const computedStyle = getComputedStyle(document.documentElement);

  // eslint-disable-next-line no-eval
  const baseWidthUnit = parseFloat(eval(computedStyle.getPropertyValue('--base-width-unit')), 10);

  const projectileWidthPropValue = computedStyle.getPropertyValue('--projectile-hitBox--width').replace(/calc|px/ig, '');
  const projectileHeightPropValue = computedStyle.getPropertyValue('--projectile-hitBox--height').replace(/calc|px/ig, '');

  // eslint-disable-next-line no-eval
  const projectileWidth = parseFloat(eval(projectileWidthPropValue), 10);
  // eslint-disable-next-line no-eval
  const projectileHeight = parseFloat(eval(projectileHeightPropValue), 10);

  let impactedUnitId = null;

  const calculatePortalExitPointCoords = (impactedUnit, newX, newY, projectileAngle) => {
    const {
      top: entranceTop, left: entranceLeft, angle: entranceAngle, meta: { exitPortalId },
    } = impactedUnit;

    const target = potentialTargetsMap
      .find(({ id: potentialTargetId }) => potentialTargetId === exitPortalId);

    if (!target) {
      return {
        x: newX,
        y: newY,
        angle: projectileAngle,
      };
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
      // eslint-disable-next-line no-param-reassign
      projectileAngle = Math.abs(newAngle) < 360 ? newAngle : newAngle % 360;

      return {
        x: newX + correctionX + offsetLeft,
        y: newY + correctionY + offsetTop,
        angle: projectileAngle,
      };
    }

    return {
      x: newX,
      y: newY,
      angle: projectileAngle,
    };
  };

  const calculateDeflectedCoords = (impactedUnit, newX, newY, projectileAngle) => {
    const { top: entranceTop, left: entranceLeft, angle: impactedUnitAngle } = impactedUnit;

    const projectileToUnitDiffAngle = Math.abs(projectileAngle - impactedUnitAngle);

    const angleToNormal = projectileToUnitDiffAngle % 180;

    const fromEntranceTopToOrigin = entranceTop - top;
    const fromEntranceLeftToOrigin = entranceLeft - left;

    const correctionX = fromEntranceLeftToOrigin - newX;
    const correctionY = fromEntranceTopToOrigin - newY;

    return {
      x: newX + correctionX,
      y: newY + correctionY,
      angle: angleToNormal === 90
        ? projectileAngle + 180
        : projectileAngle + ((90 - angleToNormal) * 2),
    };
  };

  const calculateTeleportedCoords = (impactedUnit, newX, newY, projectileAngle) => {
    const { top: entranceTop, left: entranceLeft, meta: { exitTeleportId } } = impactedUnit;

    const target = potentialTargetsMap
      .find(({ id: potentialTargetId }) => potentialTargetId === exitTeleportId);

    if (!target) {
      return {
        x: newX,
        y: newY,
        angle: projectileAngle,
      };
    }

    const { top: exitTop, left: exitLeft } = target;
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
    };
  };

  const projectileIsOutOfField = (projectilePivotX, projectilePivotY) => {
    const { fieldWidth, fieldHeight } = fieldInfo;

    const topLeftX = projectilePivotX - (projectileWidth / 2);
    const topLeftY = projectilePivotY - (projectileHeight / 2);

    const topRightX = projectilePivotX + (projectileWidth / 2);
    const topRightY = projectilePivotY + (projectileHeight / 2);

    const {
      nx: topLeftNewX,
      ny: topLeftNewY,
    } = rotate(projectilePivotX, projectilePivotY, topLeftX, topLeftY, angle * -1);
    const {
      nx: topRightNewX,
      ny: topRightNewY,
    } = rotate(projectilePivotX, projectilePivotY, topRightX, topRightY, angle * -1);

    const topLeftIsOut = topLeftNewX <= 0
      || topLeftNewY <= 0
      || topLeftNewX >= fieldWidth
      || topLeftNewY >= fieldHeight;
    const topRightIsOut = topRightNewX <= 0
      || topRightNewY <= 0
      || topRightNewX >= fieldWidth
      || topRightNewY >= fieldHeight;

    return topLeftIsOut || topRightIsOut;
  };

  const projectileDidImpact = (projectilePivotX, projectilePivotY, projectileAngle) => {
    const {
      nx: projectileX,
      ny: projectileY,
      // eslint-disable-next-line max-len
    } = rotate(projectilePivotX, projectilePivotY, projectilePivotX, projectilePivotY, projectileAngle * -1);

    let impactedUnit = null;
    let impactWithExplodingUnit = false;

    for (let i = 0; i < potentialTargetsMap.length; i += 1) {
      const potentialTarget = potentialTargetsMap[i];

      const { value, explosionStart } = units[potentialTarget.index];

      impactWithExplodingUnit = explosionStart !== undefined
        && ((+Date.now() - explosionStart) < 300);

      if (value === 0 && !impactWithExplodingUnit) {
        // eslint-disable-next-line no-continue
        continue;
      }

      const { top: centerY, left: centerX, hitBoxRadius } = potentialTarget;

      const rectangle = {
        rectangleX: projectileX,
        rectangleY: projectileY,
        rectangleWidth: projectileWidth,
        rectangleHeight: projectileHeight,
        angle: projectileAngle,
      };

      const circle = {
        circleX: centerX,
        circleY: centerY,
        radius: hitBoxRadius * baseWidthUnit,
      };

      if (findRectangleCircleIntersection(rectangle, circle)) {
        impactedUnit = potentialTarget;
        break;
      }
    }

    return {
      impactedUnit,
      impactWithExplodingUnit,
    };
  };

  const launchProjectileWithRAF = () => {
    const maxDist = (maxDistance || SAFE_MAX_DISTANCE) * moveStep;
    const duration = speed * (maxDistance || SAFE_MAX_DISTANCE);

    let currentX = 0;
    let currentY = 0;
    let currentAngle = angle;

    let currentDistance = 0;
    let initialTimeStamp;

    let { unitOfOriginId } = props;

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

      const animationPercent = (100 / duration) * deltaTimeStamp;

      initialTimeStamp = timeStamp;

      currentDistance += ((maxDist * animationPercent) / 100);

      const {
        coordinateX,
        coordinateY,
      } = calcNewCoords(currentX, currentY, currentAngle, ((maxDist * animationPercent) / 100));

      let newX = coordinateX;
      let newY = coordinateY;

      const outOfField = projectileIsOutOfField(left + newX, top + newY);

      if (outOfField) {
        setProjectileState('impact');

        onOutOfFiled(id);
        return;
      }

      const {
        impactedUnit,
        impactWithExplodingUnit,
      } = projectileDidImpact(left + newX, top + newY, currentAngle);

      if (
        impactedUnit
        && impactedUnitId !== impactedUnit.id
        && unitOfOriginId !== impactedUnit.id
      ) {
        const { type: impactedUnitType } = impactedUnit;

        impactedUnitId = impactedUnit.id;
        unitOfOriginId = impactedUnit.id;

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
            const {
              x,
              y,
              angle: newAngle,
            } = calculatePortalExitPointCoords(impactedUnit, newX, newY, currentAngle);

            newX = x;
            newY = y;
            currentAngle = newAngle;
          }

          if (impactedUnitType === 'deflector') {
            const {
              x,
              y,
              angle: newAngle,
            } = calculateDeflectedCoords(impactedUnit, newX, newY, currentAngle);

            unitOfOriginId = impactedUnit.id;

            newX = x;
            newY = y;
            currentAngle = newAngle;
          }

          if (impactedUnitType === 'teleport') {
            const {
              x,
              y,
              angle: newAngle,
              exitTeleportId,
            } = calculateTeleportedCoords(impactedUnit, newX, newY, currentAngle);
            unitOfOriginId = exitTeleportId;

            newX = x;
            newY = y;
            currentAngle = newAngle;
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
            const {
              x,
              y,
              angle: newAngle,
            } = calculatePortalExitPointCoords(impactedUnit, newX, newY, currentAngle);
            newX = x;
            newY = y;
            currentAngle = newAngle;
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
  };

  useEffect(() => {
    launchProjectileWithRAF();
  }, []);

  return (
    <div
      className={`projectile ${projectileType}`}
      id={id}
      ref={ref}
      style={{
        top,
        left,
        transform: 'translate3d(var(--offset-x), var(--offset-y), 0) rotate(var(--angle))',
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
  );
}

Projectile.propTypes = {
  id: PropTypes.string.isRequired,
  unitOfOriginId: PropTypes.string.isRequired,
  top: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  maxDistance: PropTypes.number,
  speed: PropTypes.number.isRequired,
  angle: PropTypes.number.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  units: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  potentialTargetsMap: PropTypes.array.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  fieldInfo: PropTypes.object.isRequired,
  onOutOfFiled: PropTypes.func.isRequired,
  onImpact: PropTypes.func.isRequired,
  moveStep: PropTypes.number.isRequired,
};

Projectile.defaultProps = {
  maxDistance: SAFE_MAX_DISTANCE,
};

export default Projectile;
