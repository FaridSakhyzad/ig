import BaseUnit from './BaseUnit';
import BobombTurret from '../turrets/BobombTurret';

export default class Bobomb extends BaseUnit {
  constructor(top, left, params) {
    super(top, left, {
      turrets: [
        new BobombTurret({ angle: 0 }),
        new BobombTurret({ angle: 45 }),
        new BobombTurret({ angle: 90 }),
        new BobombTurret({ angle: 135 }),
        new BobombTurret({ angle: 180 }),
        new BobombTurret({ angle: 225 }),
        new BobombTurret({ angle: 270 }),
        new BobombTurret({ angle: 315 }),
      ],
      ...params,
      type: 'bobomb',
    });
  }
}
