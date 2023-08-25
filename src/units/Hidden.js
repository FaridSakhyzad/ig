import BaseUnit from './BaseUnit';
import { UNIT_MAX_VALUE } from '../config/config';

export default class Hidden extends BaseUnit {
  constructor(top, left, params) {
    super(top, left, {
      ...params,
      type: 'hidden',
      value: UNIT_MAX_VALUE,
    });
  }
}
