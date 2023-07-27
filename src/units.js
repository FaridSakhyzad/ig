import {PROJECTILE_MOVE_DELAY, UNIT_MAX_VALUE, UNIT_MIN_VALUE} from "./config/config";

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
    { name: 'turret1', angle: 0, type: 'default', speed: PROJECTILE_MOVE_DELAY, },
    { name: 'turret2', angle: 90, type: 'default', speed: PROJECTILE_MOVE_DELAY, },
    { name: 'turret3', angle: 180, type: 'default', speed: PROJECTILE_MOVE_DELAY, },
    { name: 'turret4', angle: 270, type: 'default', speed: PROJECTILE_MOVE_DELAY, }
  ],
};

export class BaseUnit {
  constructor(top, left, params) {
    const {
      id,
      value = 0,
      type,
      minValue,
      maxValue,
      selectable,
      valueCountable,
      exploding,
      hitBoxRadius,
      angle,
      turrets,
    } = {
      ...defaults,
      ...params
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
    this.exploding = exploding;
    this.hitBoxRadius = hitBoxRadius;
    this.angle = angle;
    this.turrets = turrets;
  }
}

export class Bobomb extends BaseUnit {
  constructor(top, left, params) {
    super(top, left, {
      ...params,
      type: 'bobomb',
      turrets: [
        {
          name: 'turret1',
          angle: 0,
          type: 'bobomb',
          maxDistance: 39,
          speed: 15
        },
        {
          name: 'turret2',
          angle: 45,
          type: 'bobomb',
          maxDistance: 39 * 1.4142135623730951,
          speed: 15 / 1.4142135623730951
        },
        {
          name: 'turret3',
          angle: 90,
          type: 'bobomb',
          maxDistance: 39,
          speed: 15
        },
        {
          name: 'turret4',
          angle: 135,
          type: 'bobomb',
          maxDistance: 39 * 1.4142135623730951,
          speed: 15 / 1.4142135623730951
        },
        {
          name: 'turret5',
          angle: 180,
          type: 'bobomb',
          maxDistance: 39,
          speed: 15
        },
        {
          name: 'turret6',
          angle: 225,
          type: 'bobomb',
          maxDistance: 39 * 1.4142135623730951,
          speed: 15 / 1.4142135623730951
        },
        {
          name: 'turret7',
          angle: 270,
          type: 'bobomb',
          maxDistance: 39,
          speed: 15
        },
        {
          name: 'turret8',
          angle: 315,
          type: 'bobomb',
          maxDistance: 39 * 1.4142135623730951,
          speed: 15 / 1.4142135623730951
        }
      ],
    });
  }
}

export class Laser extends BaseUnit {
  constructor(top, left, params) {
    super(top, left, {
      ...params,
      type: 'laser',
      turrets: [
        { name: 'turret1', angle: 0, type: 'laser', speed: PROJECTILE_MOVE_DELAY, },
        { name: 'turret2', angle: 90, type: 'laser', speed: PROJECTILE_MOVE_DELAY, },
        { name: 'turret3', angle: 180, type: 'laser', speed: PROJECTILE_MOVE_DELAY, },
        { name: 'turret4', angle: 270, type: 'laser', speed: PROJECTILE_MOVE_DELAY, }
      ],
    });
  }
}

export const generateDefault = (top, left, params) => {
  return new BaseUnit(top, left, params);
}

export const generateBobomb = (top, left, params) => {
  return new Bobomb(top, left, params)
}

export const generateLaser = (top, left, params) => {
  return new Laser(top, left, params)
}

export const generatePortals = (top1, left1, top2, left2) => {
  const portal1id = Math.random().toString(16).substring(2);
  const portal2id = Math.random().toString(16).substring(2);

  return [
    {
      ...generateDefault(top1, left1),
      valueCountable: false,
      id: portal1id,
      type: 'portal',
      value: UNIT_MAX_VALUE,
      turrets: [],
      meta: {
        exitPortalId: portal2id,
      }
    },
    {
      ...generateDefault(top2, left2),

      valueCountable: false,
      id: portal2id,
      type: 'portal',
      value: UNIT_MAX_VALUE,
      turrets: [],
      angle: 180,
      meta: {
        exitPortalId: portal1id,
      }
    },
  ];
}
