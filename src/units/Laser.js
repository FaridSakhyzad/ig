import BaseUnit from './BaseUnit';
import { PROJECTILE_MOVE_DELAY } from '../config/config';

export default class Laser extends BaseUnit {
  constructor(top, left, params) {
    super(top, left, {
      turrets: [
        {
          name: 'turret1', angle: 0, type: 'laser', speed: PROJECTILE_MOVE_DELAY,
        },
        {
          name: 'turret2', angle: 90, type: 'laser', speed: PROJECTILE_MOVE_DELAY,
        },
        {
          name: 'turret3', angle: 180, type: 'laser', speed: PROJECTILE_MOVE_DELAY,
        },
        {
          name: 'turret4', angle: 270, type: 'laser', speed: PROJECTILE_MOVE_DELAY,
        },
      ],
      ...params,
      type: 'laser',
    });
  }
}
