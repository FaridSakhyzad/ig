import {PROJECTILE_MOVE_DELAY, UNIT_MAX_VALUE, UNIT_MIN_VALUE} from "./config/config";

export const defaults = {
  type: 'default',
  minValue: UNIT_MIN_VALUE,
  maxValue: UNIT_MAX_VALUE,
  selectable: true,
  valueCountable: true,
  exploding: false,
  angle: 0,
  turrets: [
    { name: 'turret1', angle: 0, type: 'default', speed: PROJECTILE_MOVE_DELAY, },
    { name: 'turret2', angle: 90, type: 'default', speed: PROJECTILE_MOVE_DELAY, },
    { name: 'turret3', angle: 180, type: 'default', speed: PROJECTILE_MOVE_DELAY, },
    { name: 'turret4', angle: 270, type: 'default', speed: PROJECTILE_MOVE_DELAY, }
  ],
};

class BaseUnit {
  constructor(top, left) {
    this.id = Math.random().toString(16).substring(2);
    this.hitBoxRadius = 4;
    this.value = UNIT_MAX_VALUE;

    this.top = top;
    this.left = left;

    this.type = 'default';
    this.minValue = UNIT_MIN_VALUE;
    this.maxValue = UNIT_MAX_VALUE;
    this.selectable = true;
    this.valueCountable = true;
    this.exploding = false;
    this.angle = 0;
    this.turrets = [
      { name: 'turret1', angle: 0, type: 'default', speed: PROJECTILE_MOVE_DELAY, },
      { name: 'turret2', angle: 90, type: 'default', speed: PROJECTILE_MOVE_DELAY, },
      { name: 'turret3', angle: 180, type: 'default', speed: PROJECTILE_MOVE_DELAY, },
      { name: 'turret4', angle: 270, type: 'default', speed: PROJECTILE_MOVE_DELAY, }
    ];
  }
}

export const generateDefault = () => {
  return {
    ...defaults,
    value: UNIT_MAX_VALUE,
    hitBoxRadius: 4,
    id: Math.random().toString(16).substring(2),
  };
}

export const generateBobomb = () => {
  return {
    ...generateDefault(),
    id: Math.random().toString(16).substring(2),
    type: 'bobomb',
    value: 1 * (UNIT_MAX_VALUE || Math.floor(Math.random() * (UNIT_MAX_VALUE - UNIT_MIN_VALUE + 1) + UNIT_MIN_VALUE)),
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
  }
}

export const generateLaser = () => {
  return {
    ...generateDefault(),
    id: Math.random().toString(16).substring(2),
    type: 'laser',
    value: UNIT_MAX_VALUE || Math.floor(Math.random() * (UNIT_MAX_VALUE - UNIT_MIN_VALUE + 1) + UNIT_MIN_VALUE),
    turrets: [
      { name: 'turret1', angle: 0, type: 'laser', speed: PROJECTILE_MOVE_DELAY, },
      { name: 'turret2', angle: 90, type: 'laser', speed: PROJECTILE_MOVE_DELAY, },
      { name: 'turret3', angle: 180, type: 'laser', speed: PROJECTILE_MOVE_DELAY, },
      { name: 'turret4', angle: 270, type: 'laser', speed: PROJECTILE_MOVE_DELAY, }
    ],
  }
}

export const generatePortals = (top1, left1, top2, left2) => {
  const portal1id = Math.random().toString(16).substring(2);
  const portal2id = Math.random().toString(16).substring(2);

  return [
    {
      ...generateDefault(),
      top: top1,
      left: left1,
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
      ...generateDefault(),
      top: top2,
      left: left2,
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
