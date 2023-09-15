import { MAP_CELL_RELATIVE_WIDTH, PROJECTILE_MOVE_DELAY } from '../config/config';
import BaseTurret from './BaseTurret';
import { BOBOMB } from '../constants/units';

export default class BobombTurret extends BaseTurret {
  constructor(params = {}) {
    const { angle } = params;

    const angleCoefficient = angle % 90 === 0 ? 1 : Math.abs(1 / Math.cos(angle * (Math.PI / 180)));

    super({
      ...params,
      maxDistance: MAP_CELL_RELATIVE_WIDTH * angleCoefficient,
      speed: PROJECTILE_MOVE_DELAY / angleCoefficient,
      type: BOBOMB.id,
    });
  }
}
