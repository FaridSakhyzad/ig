import BaseUnit from './BaseUnit';
import { UNIT_MAX_VALUE } from '../config/config';

export default class Wall extends BaseUnit {
  constructor(top, left, params = {}) {
    super(top, left, {
      ...params,
      type: 'wall',
      valueCountable: false,
      value: UNIT_MAX_VALUE,
    });

    this.kind = params.kind || 'stone';
  }
}
