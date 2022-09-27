import React, { useEffect, useState, useRef } from 'react';

const PROJECTILE_MOVE_STEP = 1;

const Projectile = (props) => {
  const { top, left, angle, parentId, speed, unitsMap } = props;

  const [ coordinates, setCoordinates ] = useState({ projectileX: left, projectileY: top,  });
  const [ isInFlight, setIsInFlight ] = useState(false);

  const computedStyle = getComputedStyle(document.documentElement);

  const unitRadius = parseInt(computedStyle.getPropertyValue('--unit-hitBox--radius'), 10);

  const projectileWidth = parseInt(computedStyle.getPropertyValue('--projectile-hitBox--width'), 10);
  const projectileHeight = parseInt(computedStyle.getPropertyValue('--projectile-hitBox--height'), 10);

  const coordinatesRef = useRef(coordinates);
  coordinatesRef.current = coordinates;

  const calculateNewCoords = (coordinateX, coordinateY) => {
    const theAngle = 90 - angle;
    const newCoordinateX = PROJECTILE_MOVE_STEP * Math.cos(theAngle * Math.PI /180);
    const newCoordinateY = PROJECTILE_MOVE_STEP * Math.sin(theAngle * Math.PI /180);

    return { coordinateX: coordinateX + newCoordinateX, coordinateY: coordinateY - newCoordinateY }
  }

  const increaseCoordinates = ({ coordinateX, coordinateY }, stepsToMake, currentStep = 0 ) => {
    const { coordinateX: currentX, coordinateY: currentY } = calculateNewCoords(coordinateX, coordinateY)

    const collision = detectCollision();

    if (collision) {
      console.log('collision', collision);
      return;
    }

    if (currentStep >= stepsToMake) {
      console.log('stop');
      return;
    }

    currentStep += 1;

    setTimeout(() => {
      setCoordinates({ projectileX: currentX, projectileY: currentY });

      increaseCoordinates({ coordinateX: currentX, coordinateY: currentY }, stepsToMake, currentStep);
    }, speed);
  };

  const hasIntersection = (rectangle, circle) => {
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

  const detectCollision = () => {
    const { projectileX, projectileY } = coordinatesRef.current;

    return !!unitsMap.find((unit, idx) => {
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

      return hasIntersection(rectangle, circle);
    });
  }

  const { projectileX, projectileY } = coordinates;

  useEffect(() => {
    if (isInFlight) {
      return;
    }

    setIsInFlight(true);
    increaseCoordinates({ coordinateX: left, coordinateY: top }, 120);
  });

  return (
    <div className="projectile" style={{ top: `${projectileY}px`, left: `${projectileX}px`, transform: `rotate(${angle}deg)` }}>
      <div className="projectile-hitBox" />
    </div>
  )
}

export default Projectile;