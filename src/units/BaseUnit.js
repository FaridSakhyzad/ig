import { PROJECTILE_MOVE_DELAY, UNIT_MAX_VALUE, UNIT_MIN_VALUE } from '../config/config';

export const defaults = {
  type: 'default',
  minValue: UNIT_MIN_VALUE,
  maxValue: UNIT_MAX_VALUE,
  selectable: true,
  valueCountable: true,
  exploding: false,
  hitBoxRadius: 4,
  angle: 0,
  turrets: [
    {
      name: 'turret1', angle: 0, type: 'default', speed: PROJECTILE_MOVE_DELAY,
    },
    {
      name: 'turret2', angle: 90, type: 'default', speed: PROJECTILE_MOVE_DELAY,
    },
    {
      name: 'turret3', angle: 180, type: 'default', speed: PROJECTILE_MOVE_DELAY,
    },
    {
      name: 'turret4', angle: 270, type: 'default', speed: PROJECTILE_MOVE_DELAY,
    },
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
    this.valueCountable = valueCountable;

    this.exploding = false;
    this.hitBoxRadius = hitBoxRadius;
    this.angle = angle;
    this.turrets = turrets;
  }
}
