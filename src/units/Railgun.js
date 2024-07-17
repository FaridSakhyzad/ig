import BaseUnit from './BaseUnit';
import RailgunTurret from '../turrets/RailTurret';

export default class Railgun extends BaseUnit {
  constructor(top, left, params) {
    super(top, left, {
      turrets: [
        new RailgunTurret({ angle: 0 }),
        new RailgunTurret({ angle: 90 }),
        new RailgunTurret({ angle: 180 }),
        new RailgunTurret({ angle: 270 }),
      ],
      ...params,
      type: 'railgun',
    });
  }
}
