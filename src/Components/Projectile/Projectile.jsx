import React, { useEffect, useState, useRef } from 'react';

const PROJECTILE_MOVE_STEP = 1;

const Projectile = (props) => {
  const {
    id,
    top,
    left,
    angle,
    parentId,
    speed,
    unitsMap,
    fieldInfo,
    onOutOfFiled,
    onImpact,
  } = props;

  const [ projectileState, setProjectileState ] = useState({
    projectileX: left,
    projectileY: top,
    projectileStatus: 'rest',
  });

  const projectileStateRef = useRef(projectileState);
  projectileStateRef.current = projectileState;

  const computedStyle = getComputedStyle(document.documentElement);

  const unitRadius = parseInt(computedStyle.getPropertyValue('--unit-hitBox--radius'), 10);
  const projectileWidth = parseInt(computedStyle.getPropertyValue('--projectile-hitBox--width'), 10);
  const projectileHeight = parseInt(computedStyle.getPropertyValue('--projectile-hitBox--height'), 10);

  const calculateNewCoords = (coordinateX, coordinateY) => {
    const theAngle = 90 - angle;
    const newCoordinateX = PROJECTILE_MOVE_STEP * Math.cos(theAngle * Math.PI /180);
    const newCoordinateY = PROJECTILE_MOVE_STEP * Math.sin(theAngle * Math.PI /180);

    return { coordinateX: coordinateX + newCoordinateX, coordinateY: coordinateY - newCoordinateY }
  }

  const launchProjectile = ({ coordinateX, coordinateY }, stepsToMake, currentStep = 0 ) => {
    const { coordinateX: currentX, coordinateY: currentY } = calculateNewCoords(coordinateX, coordinateY)

    if (currentStep >= stepsToMake) {
      console.log('stop');
      return;
    }

    currentStep += 1;

    setTimeout(() => {
      const impactedUnit = projectileDidImpact();
      const outOfField = projectileIsOutOfField();

      if (outOfField) {
        setProjectileState({
          projectileX: currentX,
          projectileY: currentY,
          projectileStatus: 'impact',
        });
        onOutOfFiled(id);

        return;
      }

      if (impactedUnit) {
        setProjectileState({
          projectileX: currentX,
          projectileY: currentY,
          projectileStatus: 'impact',
        });

        const { id: unitId } = impactedUnit;
        onImpact(id, unitId);

        return;
      }

      console.log('inner setProjectileState');
      setProjectileState({ projectileX: currentX, projectileY: currentY, projectileStatus: 'inFlight' });

      console.log('inner launchProjectile');
      launchProjectile({ coordinateX: currentX, coordinateY: currentY }, stepsToMake, currentStep);
    }, speed);
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
    const { projectileX, projectileY } = projectileStateRef.current;

    const { fieldWidth, fieldHeight } = fieldInfo;

    const topLeftX = projectileX - (projectileWidth / 2);
    const topLeftY = projectileY - (projectileHeight / 2);

    const topRightX = projectileX + (projectileWidth / 2);
    const topRightY = projectileY + (projectileHeight / 2);

    const { nx: topLeftNewX, ny: topLeftNewY } = rotate(projectileX, projectileY, topLeftX, topLeftY, angle * -1);
    const { nx: topRightNewX, ny: topRightNewY } = rotate(projectileX, projectileY, topRightX, topRightY, angle * -1);

    const topLeftIsOut = topLeftNewX <= 0 || topLeftNewY <= 0 || topLeftNewX >= fieldWidth || topLeftNewY >= fieldHeight;
    const topRightIsOut = topRightNewX <= 0 || topRightNewY <= 0 || topRightNewX >= fieldWidth || topRightNewY >= fieldHeight;

    return topLeftIsOut || topRightIsOut;
  }

  const projectileDidImpact = () => {
    const { projectileX, projectileY } = projectileStateRef.current;

    return unitsMap.find((unit, idx) => {
      if (!unit || parentId === idx) {
        return false;
      }

      const { top: circleY, left: circleX } = unit;

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

  const { projectileX, projectileY, projectileStatus } = projectileState;

  useEffect(() => {
    if (projectileStatus !== 'rest') {
      return;
    }

    launchProjectile({ coordinateX: left, coordinateY: top }, 140);
  });

  return (
    <div className="projectile" style={{ top: `${projectileY}px`, left: `${projectileX}px`, transform: `rotate(${angle}deg)` }}>
      <div className="projectile-hitBox" />
      {projectileStatus === 'inFlight' && (
        <div className="projectile-image" />
      )}

      {projectileStatus === 'impact' && (
        <div className="projectile-explosion" />
      )}
    </div>
  )
}

export default Projectile;