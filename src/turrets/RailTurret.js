import BaseTurret from './BaseTurret';
import { RAILGUN_TURRET } from '../constants/turrets';

export default class RailgunTurret extends BaseTurret {
  constructor(params = {}) {
    super({
      ...params,
      type: RAILGUN_TURRET.id,
    });
  }
}
