import { PROJECTILE_MOVE_DELAY } from '../config/config';

const UNIT_MAX_VALUE = 4;
const UNIT_MIN_VALUE = 0;

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

export const generateDefault = () => {
  return {
    ...defaults,
    value: UNIT_MAX_VALUE,
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
        siblingId: portal2id,
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
        siblingId: portal1id,
      }
    }
  ];
}

const MAP_9x9_0 = (mapWidth, mapHeight) => {
  const result = [];


  for (let i = 0; i < mapHeight; i++) {
    for (let j = 0; j < mapWidth; j++) {
      result.push({
        top: i,
        left: j,
        ...generateDefault(),
        id: Math.random().toString(16).substring(2),
        value: 0 * Math.pow(Math.floor(Math.random() * (UNIT_MAX_VALUE - UNIT_MIN_VALUE + 1) + UNIT_MIN_VALUE), 0),
      });
    }
  }

  result[0] = {
    ...generateDefault(),
    top: 0,
    left: 0,
    id: Math.random().toString(16).substring(2),
    type: 'turf',
    kind: 'water',
    selectable: false,
    valueCountable: false,
    value: 0,
  }

  result[1] = {
    ...generateDefault(),
    top: 0,
    left: 1,
    id: Math.random().toString(16).substring(2),
    type: 'turf',
    kind: 'grass',
    selectable: false,
    valueCountable: false,
    value: 0,
  }

  result[mapWidth * 1 + 3] = {
    ...generateDefault(),
    top: 1,
    left: 3,
    id: Math.random().toString(16).substring(2),
    type: 'wall',
    kind: 'stone',
    valueCountable: false,
    value: 1 * (UNIT_MAX_VALUE || Math.floor(Math.random() * (UNIT_MAX_VALUE - UNIT_MIN_VALUE + 1) + UNIT_MIN_VALUE)),
  }

  result[mapWidth * 2] = {
    top: 2,
    left: 0,
    ...generateDefault(),
    id: Math.random().toString(16).substring(2),
    type: 'npc',
    selectable: false,
    value: UNIT_MAX_VALUE,
  }

  result[mapWidth * 2 + 3] = {
    ...generateDefault(),
    top: 2,
    left: 3,
    id: Math.random().toString(16).substring(2),
    type: 'wall',
    kind: 'wood',
    valueCountable: false,
    value: 1 * (UNIT_MAX_VALUE || Math.floor(Math.random() * (UNIT_MAX_VALUE - UNIT_MIN_VALUE + 1) + UNIT_MIN_VALUE)),
  }

  result[mapWidth * 1 + 4] = {
    top: 1,
    left: 4,
    ...generateDefault(),
    id: Math.random().toString(16).substring(2),
    type: 'hidden',
    value: 1 * (UNIT_MAX_VALUE || Math.floor(Math.random() * (UNIT_MAX_VALUE - UNIT_MIN_VALUE + 1) + UNIT_MIN_VALUE)),
  }

  result[mapWidth * 2 + 2] = {
    ...generateBobomb(),
    top: 2,
    left: 2,
  }

  result[mapWidth * 3 + 3] = {
    ...generateDefault(),
    top: 3,
    left: 3,
    id: Math.random().toString(16).substring(2),
    value: 1,
  }

  result[mapWidth * 3 + 5] = {
    top: 3,
    left: 5,
    ...generateLaser(),
  }

  result[mapWidth * 4 + 3] = {
    ...generateDefault(),
    top: 4,
    left: 3,
    id: Math.random().toString(16).substring(2),
    value: 1,
  }

  result[mapWidth * 4 + 5] = {
    top: 4,
    left: 5,
    ...generateLaser(),
  };

  result[mapWidth * mapHeight - mapWidth] = {
    ...generateDefault(),
    top: 8,
    left: 0,
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

  const portal1id = Math.random().toString(16).substring(2);
  const portal2id = Math.random().toString(16).substring(2);

  result[44] = {
    top: 4,
    left: 8,
    ...generateDefault(),
    value: UNIT_MAX_VALUE,
    turrets: [
      { name: 'turret1', angle: 0, type: 'default', speed: PROJECTILE_MOVE_DELAY, },
      { name: 'turret2', angle: 180, type: 'default', speed: PROJECTILE_MOVE_DELAY, },
    ],
  }

  result[8] = {
    top: 0,
    left: 8,
    ...generateDefault(),
    valueCountable: false,
    id: portal1id,
    type: 'portal',
    value: UNIT_MAX_VALUE,
    turrets: [],
    angle: 180,
    meta: {
      siblingId: portal2id,
    }
  }

  result[mapWidth * (mapHeight - 1) + 8] = {
    top: 8,
    left: 8,
    ...generateDefault(),
    valueCountable: false,
    id: portal2id,
    type: 'portal',
    value: UNIT_MAX_VALUE,
    turrets: [],
    angle: 0,
    meta: {
      siblingId: portal1id,
    }
  }

  result.splice(34, 1);

  return result;
};


export default MAP_9x9_0;
