import React, { useEffect, useState, useRef } from 'react';

const PROJECTILE_MOVE_DELAY = 25; //ms per pixel
const PROJECTILE_MOVE_STEP = 1;

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

  const ref = useRef(null);

  const computedStyle = getComputedStyle(document.documentElement);

  const unitRadius = parseInt(computedStyle.getPropertyValue('--unit-hitBox--radius'), 10);
  const projectileWidth = parseInt(computedStyle.getPropertyValue('--projectile-hitBox--width'), 10);
  const projectileHeight = parseInt(computedStyle.getPropertyValue('--projectile-hitBox--height'), 10);

  const calculateNewCoords = (coordinateX, coordinateY) => {
    const theAngle = 90 - angle;
    const newCoordinateX = PROJECTILE_MOVE_STEP * Math.cos(theAngle * Math.PI / 180);
    const newCoordinateY = PROJECTILE_MOVE_STEP * Math.sin(theAngle * Math.PI / 180);

    return { coordinateX: coordinateX + newCoordinateX, coordinateY: coordinateY - newCoordinateY }
  }

  const launchProjectile = (maxDistance, currentDistance = 0, coordinateX = left, coordinateY = top) => {
    if (currentDistance >= maxDistance) {
      console.log('Stopped by Steps Limit', id);
      return;
    }

    if (projectileState !== 'inFlight') {
      setProjectileState('inFlight');
    }

    const { coordinateX: currentLeft, coordinateY: currentTop } = calculateNewCoords(coordinateX, coordinateY)

    const timer = setTimeout(() => {
      // const { top: currentAbsTop, left: currentAbsLeft } = ref.current.getBoundingClientRect();
      // const currentTop = currentAbsTop - fieldTop;
      // const currentLeft = currentAbsLeft - fieldLeft;

      console.log('left, top', left, top);
      console.log('currentLeft, currentTop', currentLeft, currentTop);

      currentDistance = Math.sqrt(Math.pow((currentTop - top), 2) + Math.pow((currentLeft - left), 2));

      const outOfField = projectileIsOutOfField(currentDistance);

      if (outOfField) {
        onOutOfFiled(id);

        console.log('clearTimeout');
        clearTimeout(timer);

        setProjectileState('impact');
        return;
      }

      const impactedUnit = projectileDidImpact(currentDistance);

      if (impactedUnit && impactedUnit.value > 0) {
        onImpact(id, impactedUnit.id);

        console.log('clearTimeout');
        clearTimeout(timer);

        setProjectileState('impact');
        return;
      }

      setProjectileDistance(currentDistance);
      launchProjectile(maxDistance, currentDistance, currentLeft, currentTop);
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

  const MAX_DISTANCE = 900;

  useEffect(() => {
    if (projectileState === 'inFlight' || projectileState === 'impact') {
      return;
    }

    console.log(`Launch Projectile. ID ${id}. Status ${projectileState}`, '\n\n');
    launchProjectile(MAX_DISTANCE);
  }, []);

  console.log('projectileDistance', projectileDistance);

  return (
    <div className="projectile"
      id={id}
      ref={ref}
      style={{
        top,
        left,
        // '--angle': `${angle}deg`,
        // '--distance': `${MAX_DISTANCE * -1}px`,
        // '--duration': `${MAX_DISTANCE * PROJECTILE_MOVE_DELAY}ms`,
        // animationPlayState: projectileState === 'inFlight' ? 'running' : 'paused'
        transform: `rotate(${angle}deg) translateY(${-1 * projectileDistance}px)`
      }}
      data-state={projectileState}
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