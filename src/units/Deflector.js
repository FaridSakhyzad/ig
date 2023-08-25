import { UNIT_MAX_VALUE } from 'config/config';
import BaseUnit from './BaseUnit';

export default class Deflector extends BaseUnit {
  constructor(top, left, params) {
    super(top, left, {
      ...params,
      type: 'deflector',
      valueCountable: false,
      turrets: [],
      value: UNIT_MAX_VALUE,
    });
  }
}
