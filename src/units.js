import { PROJECTILE_MOVE_DELAY, UNIT_MAX_VALUE, UNIT_MIN_VALUE } from "./config/config";

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

    this.exploding = false;
    this.hitBoxRadius = hitBoxRadius;
    this.angle = angle;
    this.turrets = turrets;
  }
}

export class Bobomb extends BaseUnit {
  constructor(top, left, params) {
    super(top, left, {
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
      ...params,
      type: 'bobomb',
    });
  }
}

export class Laser extends BaseUnit {
  constructor(top, left, params) {
    super(top, left, {
      turrets: [
        { name: 'turret1', angle: 0, type: 'laser', speed: PROJECTILE_MOVE_DELAY, },
        { name: 'turret2', angle: 90, type: 'laser', speed: PROJECTILE_MOVE_DELAY, },
        { name: 'turret3', angle: 180, type: 'laser', speed: PROJECTILE_MOVE_DELAY, },
        { name: 'turret4', angle: 270, type: 'laser', speed: PROJECTILE_MOVE_DELAY, }
      ],
      ...params,
      type: 'laser',
    });
  }
}

export class Deflector extends BaseUnit {
  constructor(top, left, params) {
    super(top, left, {
      ...params,
      type: 'deflector',
      valueCountable: false,
      turrets: [],
      value: 4,
    });
  }
}

export class Wall extends BaseUnit {
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

export class Npc extends BaseUnit {
  constructor(top, left, params) {
    super(top, left, {
      ...params,
      type: 'npc',
      selectable: false,
      value: UNIT_MAX_VALUE,
    });
  }
}

export class Hidden extends BaseUnit {
  constructor(top, left, params) {
    super(top, left, {
      ...params,
      type: 'hidden',
      value: UNIT_MAX_VALUE,
    });
  }
}

export class Portal extends BaseUnit {
  constructor(top, left, params = {}) {
    super(top, left, {
      ...params,
      valueCountable: false,
      type: 'portal',
      value: UNIT_MAX_VALUE,
    });

    this.meta = params.meta || {};
  }
  setExitPortalId(id) {
    this.meta.exitPortalId = id;
  }
}

export class Teleport extends BaseUnit {
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

export const generatePortals = (top1, left1, top2, left2) => {
  const portal1 = new Portal(top1, left1);
  const portal2 = new Portal(top2, left2, { angle: 180 });

  portal1.setExitPortalId(portal2.id);
  portal2.setExitPortalId(portal1.id);

  return [ portal1, portal2 ];
}

export const generateTeleports = (top1, left1, top2, left2) => {
  const teleport1 = new Teleport(top1, left1);
  const teleport2 = new Teleport(top2, left2);

  teleport1.setExitTeleportId(teleport2.id);
  teleport2.setExitTeleportId(teleport1.id);

  return [ teleport1, teleport2 ];
}
