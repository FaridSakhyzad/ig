import React, {useEffect, useState} from 'react';
import Projectile from './Projectile';

const PROJECTILE_SPEED = 50; //ms per pixel

const Playground = () => {
  const [ units, setUnits ] = useState([
    {
      value: 11,
      turrets: [
        {
          name: 'turret1',
          angle: 35,
        },
        {
          name: 'turret2',
          angle: 120,
        },
        {
          name: 'turret3',
          angle: 195,
        },
        {
          name: 'turret4',
          angle: 280,
        }
      ],
    },
    { value: 12 },
    { value: 13 },
    { value: 21 },
    { value: 22 },
    { value: 23 },
    { value: 31 },
    { value: 32 },
    { value: 33 },
  ]);

  const [ projectiles, setProjectiles ] = useState([]);

  const onClick = (e, id) => {
    const { currentTarget } = e;
    const { value, turrets } = units[id];

    const projectiles = [];

    currentTarget.querySelectorAll('.turret').forEach(turret => {
      const gunpoint = turret.querySelector('.gunpoint');

      const { name: turretName } = turret.dataset;

      const { angle } = turrets.find(({ name }) => (name === turretName));

      const { top, left } = gunpoint.getBoundingClientRect();

      projectiles.push({ top, left, angle });
    })

    setProjectiles(projectiles);
  }

  const BULLET_WIDTH = 20;
  const BULLET_HEIGHT = 40;
  const BULLET_ANGLE = 0;

  const ITEM_RADIUS = 40;

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

  useEffect(() => {
    const bullet = document.querySelector('.theBulletPivot');
    const item = document.querySelector('.theItemPivot');

    const { top: rectangleY, left: rectangleX } = bullet.getBoundingClientRect();
    const { top: circleY, left: circleX } = item.getBoundingClientRect();

    const rectangle = {
      rectangleX,
      rectangleY,
      rectangleWidth: BULLET_WIDTH,
      rectangleHeight: BULLET_HEIGHT,
      angle: BULLET_ANGLE,
    };

    const circle = {
      circleX,
      circleY,
      radius: ITEM_RADIUS
    };

    const isIntersection = hasIntersection(rectangle, circle);
  })

  return (
    <>
      <div className="theBulletPivot" style={{ display: 'none' }}>
        <div
          className="theBullet"
          style={{ '--width': `${BULLET_WIDTH}px`, '--height': `${BULLET_HEIGHT}px`, '--angle': `${BULLET_ANGLE}deg` }}
        />
      </div>
      <div className="theItemPivot" style={{ display: 'none' }}>
        <div
          className="theItem"
          style={{ '--radius': `${ITEM_RADIUS}px` }}
        />
      </div>

      <div className="field" id="field">
        {projectiles.map(({ top, left, angle }, ixd) => (
          <Projectile
            key={ixd}
            top={top}
            left={left}
            angle={angle}
            speed={PROJECTILE_SPEED}
          />
        ))}
        <div className="unitsLayer">
          {units.map(({ turrets }, itemIndex) => (
            <div className="unit" id={itemIndex} key={itemIndex} onClick={(e) => onClick(e, itemIndex)}>
              <div className="unit-hitBox" />
              {turrets && turrets.map(({ angle, name}, emitterIndex) => (
                <div className={`turret ${name}`} data-name={name} style={{ transform: `rotate(${angle}deg)` }} key={emitterIndex}>
                  <div className="weapon">
                    <div className="gunpoint" />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Playground;