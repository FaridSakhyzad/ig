import { PROJECTILE_MOVE_DELAY, SAFE_MAX_DISTANCE } from '../config/config';

export default class BaseTurret {
  name;

  angle;

  type;

  maxDistance;

  speed;

  constructor(params = {}) {
    const {
      name,
      angle = 0,
      type = 'default',
      maxDistance = SAFE_MAX_DISTANCE,
      speed = PROJECTILE_MOVE_DELAY,
    } = params;

    this.name = name || `turret_${Math.random().toString(16).substring(2)}`;
    this.angle = angle;
    this.type = type;
    this.maxDistance = maxDistance;
    this.speed = speed;
  }
}
