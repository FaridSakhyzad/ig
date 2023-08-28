import BaseUnit from './BaseUnit';
import { UNIT_MAX_VALUE } from '../config/config';

export default class Portal extends BaseUnit {
  constructor(top, left, params = {}) {
    super(top, left, {
      ...params,
      valueCountable: false,
      type: 'portal',
      value: UNIT_MAX_VALUE,
      turrets: [],
    });

    this.meta = params.meta || {};
  }

  setExitPortalId(id) {
    this.meta.exitPortalId = id;
  }
}
