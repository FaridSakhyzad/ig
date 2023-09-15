import BaseTurret from './BaseTurret';
import { LASER_TURRET } from '../constants/turrets';

export default class LaserTurret extends BaseTurret {
  constructor(params = {}) {
    super({
      ...params,
      type: LASER_TURRET.id,
    });
  }
}
