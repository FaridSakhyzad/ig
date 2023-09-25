import { UNIT_MAX_VALUE, UNIT_MIN_VALUE } from '../config/config';
import BaseTurret from '../turrets/BaseTurret';
import { BASE_UNIT } from '../constants/units';

export const defaults = {
  type: BASE_UNIT.id,
  minValue: UNIT_MIN_VALUE,
  maxValue: UNIT_MAX_VALUE,
  selectable: true,
  valueCountable: true,
  exploding: false,
  hitBoxRadius: 4,
  angle: 0,
  turrets: [
    new BaseTurret({ angle: 0 }),
    new BaseTurret({ angle: 90 }),
    new BaseTurret({ angle: 180 }),
    new BaseTurret({ angle: 270 }),
  ],
};

export default class BaseUnit {
  constructor(top, left, params) {
    const {
      id,
      value = 0,
      type,
      minValue,
      maxValue,
      selected = false,
      selectable,
      valueCountable,
      hitBoxRadius,
      angle,
      turrets,
    } = {
      ...defaults,
      ...params,
    };

    this.top = top;
    this.left = left;

    this.id = id || Math.random().toString(16).substring(2);

    this.value = value;
    this.type = type;
    this.minValue = minValue;
    this.maxValue = maxValue;
    this.selectable = selectable;
    this.selected = selected;
    this.valueCountable = valueCountable;

    this.exploding = false;
    this.hitBoxRadius = hitBoxRadius;

    this.angle = angle;
    this.turrets = turrets;
  }
}
