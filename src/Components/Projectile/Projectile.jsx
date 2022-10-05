import React, { useEffect, useState, useRef } from 'react';

const PROJECTILE_MOVE_STEP = 1;
const PROJECTILE_MOVE_DELAY = 50; //ms per pixel

const Projectile = (props) => {
  const {
    id,
    top,
    left,
    angle,
    parentId,
    units,
    unitsMap,
    fieldInfo,
    onOutOfFiled,
    onImpact,
  } = props;

  const [ projectileDistance, setProjectileDistance ] = useState(0);
  const projectileDistanceRef = useRef(projectileDistance);
  projectileDistanceRef.current = projectileDistance;

  const [ projectileState, setProjectileState ] = useState('rest');
  const projectileStateRef = useRef(projectileState);
  projectileStateRef.current = projectileState;

  const computedStyle = getComputedStyle(document.documentElement);

  const unitRadius = parseInt(computedStyle.getPropertyValue('--unit-hitBox--radius'), 10);
  const projectileWidth = parseInt(computedStyle.getPropertyValue('--projectile-hitBox--width'), 10);
  const projectileHeight = parseInt(computedStyle.getPropertyValue('--projectile-hitBox--height'), 10);

  const launchProjectile = (stepsToMake, currentStep = 0 ) => {
    if (currentStep >= stepsToMake) {
      console.log('Stopped by Steps Limit', id);
      return;
    }

    currentStep += 1;

    setProjectileDistance(currentStep);

    setTimeout(() => {
      const impactedUnit = projectileDidImpact();
      const outOfField = projectileIsOutOfField();

      if (outOfField) {
        setProjectileState('impact');

        onOutOfFiled(id);

        return;
      }

      if (impactedUnit && impactedUnit.value > 0) {
        setProjectileState('impact');

        onImpact(id, impactedUnit.id);

        return;
      }

      if (projectileState !== 'inFlight') {
        setProjectileState('inFlight');
      }

      launchProjectile(stepsToMake, currentStep);
    }, PROJECTILE_MOVE_DELAY);
  };

  const findIntersection = (rectangle, circle) => {
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

  const projectileIsOutOfField = () => {
    const projectilePivotX = left;
    const projectilePivotY = top;

    const { fieldWidth, fieldHeight } = fieldInfo;

    const topLeftX = projectilePivotX - (projectileWidth / 2);
    const topLeftY = projectilePivotY - (projectileHeight / 2) - projectileDistanceRef.current;

    const topRightX = projectilePivotX + (projectileWidth / 2);
    const topRightY = projectilePivotY + (projectileHeight / 2) - projectileDistanceRef.current;

    const { nx: topLeftNewX, ny: topLeftNewY } = rotate(projectilePivotX, projectilePivotY, topLeftX, topLeftY, angle * -1);
    const { nx: topRightNewX, ny: topRightNewY } = rotate(projectilePivotX, projectilePivotY, topRightX, topRightY, angle * -1);

    const topLeftIsOut = topLeftNewX <= 0 || topLeftNewY <= 0 || topLeftNewX >= fieldWidth || topLeftNewY >= fieldHeight;
    const topRightIsOut = topRightNewX <= 0 || topRightNewY <= 0 || topRightNewX >= fieldWidth || topRightNewY >= fieldHeight;

    return topLeftIsOut || topRightIsOut;
  }

  const projectileDidImpact = () => {
    const projectilePivotX = left;
    const projectilePivotY = top;

    const { nx: projectileX, ny: projectileY } =
      rotate(projectilePivotX, projectilePivotY, projectilePivotX, projectilePivotY - projectileDistanceRef.current, angle * -1);

    return unitsMap.find((unitsMapItem) => {
      if (!unitsMapItem || unitsMapItem.id === parentId) {
        return false;
      }

      const { value } = units[unitsMapItem.index];

      if (value === 0) {
        return false;
      }

      const { top: circleY, left: circleX } = unitsMapItem;

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

      return findIntersection(rectangle, circle);
    });
  }

  useEffect(() => {
    console.log('\nProjectile Rerender\n\n');

    if (projectileState === 'inFlight' || projectileState === 'impact') {
      return;
    }

    console.log(`Launch Projectile. ID ${id}. Status ${projectileState}`, '\n\n');
    launchProjectile(200);
  });

  return (
    <div className="projectile"
      id={id}
      style={{
        top,
        left,
        transform: `rotate(${angle}deg) translateY(${-1 * projectileDistance}px)`
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