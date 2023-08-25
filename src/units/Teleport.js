import BaseUnit from './BaseUnit';
import { UNIT_MAX_VALUE } from '../config/config';

export default class Teleport extends BaseUnit {
  constructor(top, left, params = {}) {
    super(top, left, {
      ...params,
      valueCountable: false,
      type: 'teleport',
      value: UNIT_MAX_VALUE,
    });

    this.meta = params.meta || {};
  }

  setExitTeleportId(id) {
    this.meta.exitTeleportId = id;
  }
}
