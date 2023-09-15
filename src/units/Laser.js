import BaseUnit from './BaseUnit';
import LaserTurret from '../turrets/LaserTurret';

export default class Laser extends BaseUnit {
  constructor(top, left, params) {
    super(top, left, {
      turrets: [
        new LaserTurret({ angle: 0 }),
        new LaserTurret({ angle: 90 }),
        new LaserTurret({ angle: 180 }),
        new LaserTurret({ angle: 270 }),
      ],
      ...params,
      type: 'laser',
    });
  }
}
