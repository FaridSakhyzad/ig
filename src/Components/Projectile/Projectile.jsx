import React, { useEffect, useState, useRef } from 'react';
import { PROJECTILE_MOVE_DELAY, PROJECTILE_MOVE_STEP, MAX_DISTANCE } from '../../Config/config';
import PropTypes from 'prop-types';

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

  const ref = useRef(null);

  const computedStyle = getComputedStyle(document.documentElement);

  const unitRadius = parseInt(computedStyle.getPropertyValue('--unit-hitBox--radius'), 10);
  const projectileWidth = parseInt(computedStyle.getPropertyValue('--projectile-hitBox--width'), 10);
  const projectileHeight = parseInt(computedStyle.getPropertyValue('--projectile-hitBox--height'), 10);

  const calculateNewCoords = (coordinateX, coordinateY) => { // eslint-disable-line
    const theAngle = 90 - angle;
    const newCoordinateX = PROJECTILE_MOVE_STEP * Math.cos(theAngle * Math.PI / 180);
    const newCoordinateY = PROJECTILE_MOVE_STEP * Math.sin(theAngle * Math.PI / 180);

    return { coordinateX: coordinateX + newCoordinateX, coordinateY: coordinateY - newCoordinateY }
  }

  const moveProjectile = () => { // eslint-disable-line
    function animate({duration}) {

      let start = performance.now();

      requestAnimationFrame(function animate(time) {
        // timeFraction изменяется от 0 до 1
        let timeFraction = (time - start) / duration;
        if (timeFraction > 1) timeFraction = 1;

        const currentDistance = timeFraction * MAX_DISTANCE;

        const outOfField = projectileIsOutOfField(currentDistance, left, top, projectileWidth, projectileHeight, angle, fieldInfo.fieldWidth, fieldInfo.fieldHeight);

        if (outOfField) {
          onOutOfFiled(id);

          setProjectileState('impact');
          return;
        }

        const impactedUnit = projectileDidImpact(currentDistance);

        if (impactedUnit && impactedUnit.value > 0) {
          onImpact(id, impactedUnit.id, impactedUnit.index);

          setProjectileState('impact');
          return;
        }

        ref.current.style.transform = `rotate(${angle}deg) translateY(${`${-1 * currentDistance}px`})`

        if (timeFraction < 1) {
          requestAnimationFrame(animate);
        }
      });
    }

    animate({ duration: PROJECTILE_MOVE_DELAY * MAX_DISTANCE });
  };

  const launchProjectile = (currentDistance = 0) => {
    if (currentDistance >= MAX_DISTANCE) {
      console.log('Stopped by Steps Limit', id);
      return;
    }

    const timer = setTimeout(() => {
      currentDistance += 1;

      const outOfField = projectileIsOutOfField(currentDistance);

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
      launchProjectile(currentDistance);
    }, PROJECTILE_MOVE_DELAY);
  };

  const findRectangleCircleIntersection = (rectangle, circle) => {
    const { rectangleX, rectangleY, rectangleWidth, rectangleHeight, angle } = rectangle;
    const { circleX, circleY, radius } = circle;

    const { nx: newCircleX, ny: newCircleY } = rotate(rectangleX, rectangleY, circleX, circleY, angle);

    const centersDistanceX = rectangleX > newCircleX ? rectangleX - newCircleX : newCircleX - rectangleX;
    const centersDistanceY = rectangleY > newCircleY ? rectangleY - newCircleY : newCircleY - rectangleY;

    if (centersDistanceX >= ((rectangleWidth / 2) + radius)) {
      return false;
    }

    if (centersDistanceY >= ((rectangleHeight / 2) + radius)) {
      return false;
    }

    const closestCornerX = newCircleX < rectangleX ? rectangleX - (rectangleWidth / 2) : rectangleX + (rectangleWidth / 2);
    const closestCornerY = newCircleY < rectangleY ? rectangleY - (rectangleHeight / 2) : rectangleX + (rectangleHeight / 2);

    const deltaX = newCircleX < closestCornerX ? newCircleX - closestCornerX : closestCornerX - newCircleX;
    const deltaY = newCircleY < closestCornerY ? newCircleY - closestCornerY : closestCornerY - newCircleY;

    const cornerDistancePow = Math.pow(deltaX, 2) + Math.pow(deltaY, 2);

    return cornerDistancePow < Math.pow(radius, 2);
  }

  const rotate = (cx, cy, x, y, angle) => {
    const radians = (Math.PI / 180) * angle,
      cos = Math.cos(radians),
      sin = Math.sin(radians),
      nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
      ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;

    return { nx, ny };
  }

  const projectileIsOutOfField = (distance) => {
    const projectilePivotX = left;
    const projectilePivotY = top;

    const { fieldWidth, fieldHeight } = fieldInfo;

    const topLeftX = projectilePivotX - (projectileWidth / 2);
    const topLeftY = projectilePivotY - (projectileHeight / 2) - distance;

    const topRightX = projectilePivotX + (projectileWidth / 2);
    const topRightY = projectilePivotY + (projectileHeight / 2) - distance;

    const { nx: topLeftNewX, ny: topLeftNewY } = rotate(projectilePivotX, projectilePivotY, topLeftX, topLeftY, angle * -1);
    const { nx: topRightNewX, ny: topRightNewY } = rotate(projectilePivotX, projectilePivotY, topRightX, topRightY, angle * -1);

    const topLeftIsOut = topLeftNewX <= 0 || topLeftNewY <= 0 || topLeftNewX >= fieldWidth || topLeftNewY >= fieldHeight;
    const topRightIsOut = topRightNewX <= 0 || topRightNewY <= 0 || topRightNewX >= fieldWidth || topRightNewY >= fieldHeight;

    return topLeftIsOut || topRightIsOut;
  }

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
    launchProjectile();
  }, []);

  return (
    <div className="projectile"
      id={id}
      ref={ref}
      style={{
        top,
        left,
        transform: `rotate(${angle}deg) translateY(var(--distance))`
        // '--angle': `${angle}deg`,
        // animationPlayState: projectileState === 'inFlight' ? 'running' : 'paused'
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
  angle: PropTypes.number,
  units: PropTypes.array,
  potentialTargetsMap: PropTypes.array,
  fieldInfo: PropTypes.object,
  onOutOfFiled: PropTypes.func,
  onImpact: PropTypes.func,
};

export default Projectile;