import BaseUnit from './BaseUnit';
import { UNIT_MAX_VALUE } from '../config/config';

export default class Npc extends BaseUnit {
  constructor(top, left, params) {
    super(top, left, {
      ...params,
      type: 'npc',
      selectable: false,
      value: UNIT_MAX_VALUE,
    });
  }
}
