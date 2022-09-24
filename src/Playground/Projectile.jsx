import React, { useEffect, useState } from 'react';

const PROJECTILE_MOVE_STEP = 1;

const Projectile = ({ top, left, angle, speed }) => {
  const [ coordinates, setCoordinates ] = useState({ projectileX: left, projectileY: top,  });
  const [ isInFlight, setIsInFlight ] = useState(false);

  const calculateNewCoords = (coordinateX, coordinateY) => {
    const theAngle = 90 - angle;
    const newCoordinateX = PROJECTILE_MOVE_STEP * Math.cos(theAngle * Math.PI /180)
    const newCoordinateY = PROJECTILE_MOVE_STEP * Math.sin(theAngle * Math.PI /180)

    return { coordinateX: coordinateX + newCoordinateX, coordinateY: coordinateY - newCoordinateY }
  }

  const increaseCoordinates = ({ coordinateX, coordinateY }, stepsToMake, currentStep = 0 ) => {
    const { coordinateX: currentX, coordinateY: currentY } = calculateNewCoords(coordinateX, coordinateY)

    if (currentStep < stepsToMake) {
      currentStep += 1;

      setTimeout(() => {
        console.log({ left: currentX, top: currentY });

        setCoordinates({ projectileX: currentX, projectileY: currentY });

        increaseCoordinates({ coordinateX: currentX, coordinateY: currentY }, stepsToMake, currentStep);
      }, speed);
    }
  };

  useEffect(() => {
    if (!isInFlight) {
      setIsInFlight(true);
      increaseCoordinates({ coordinateX: left, coordinateY: top }, 20);
    }
  });

  const { projectileX, projectileY } = coordinates;

  return (
    <div className="projectile" style={{ top: `${projectileY}px`, left: `${projectileX}px`, transform: `rotate(${angle}deg)` }}>
      <div className="projectile-hitBox" />
    </div>
  )
}

export default Projectile;