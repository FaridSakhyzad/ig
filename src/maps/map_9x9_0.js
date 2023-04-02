import { PROJECTILE_MOVE_DELAY } from '../config/config';

const UNIT_MAX_VALUE = 4;
const UNIT_MIN_VALUE = 0

const MAP_9x9_0 = (mapWidth, mapHeight) => {
  const result = [];

  const defaults = {
    type: 'default',
    minValue: UNIT_MIN_VALUE,
    maxValue: UNIT_MAX_VALUE,
    valueCountable: true,
    angle: 0,
    turrets: [
      { name: 'turret1', angle: 0, type: 'default', speed: PROJECTILE_MOVE_DELAY, },
      { name: 'turret2', angle: 90, type: 'default', speed: PROJECTILE_MOVE_DELAY, },
      { name: 'turret3', angle: 180, type: 'default', speed: PROJECTILE_MOVE_DELAY, },
      { name: 'turret4', angle: 270, type: 'default', speed: PROJECTILE_MOVE_DELAY, }
    ],
  }

  for (let i = 0; i < mapWidth * mapHeight; i++) {
    result.push({
      ...defaults,
      id: Math.random().toString(16).substring(2),
      value: 0 * Math.pow(Math.floor(Math.random() * (UNIT_MAX_VALUE - UNIT_MIN_VALUE + 1) + UNIT_MIN_VALUE), 0),
    });
  }

  result[mapWidth * 1 + 3] = {
    ...defaults,
    id: Math.random().toString(16).substring(2),
    type: 'wall',
    valueCountable: false,
    value: 1 * (UNIT_MAX_VALUE || Math.floor(Math.random() * (UNIT_MAX_VALUE - UNIT_MIN_VALUE + 1) + UNIT_MIN_VALUE)),
  }

  result[mapWidth * 1 + 4] = {
    ...defaults,
    id: Math.random().toString(16).substring(2),
    type: 'hidden',
    value: 1 * (UNIT_MAX_VALUE || Math.floor(Math.random() * (UNIT_MAX_VALUE - UNIT_MIN_VALUE + 1) + UNIT_MIN_VALUE)),
  }

  result[mapWidth * 2 + 2] = {
    ...defaults,
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

  result[mapWidth * 3 + 3] = {
    ...defaults,
    id: Math.random().toString(16).substring(2),
    value: 1,
  }

  result[mapWidth * 3 + 5] = {
    ...defaults,
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

  result[mapWidth * 4 + 3] = {
    ...defaults,
    id: Math.random().toString(16).substring(2),
    value: 1,
  }

  result[mapWidth * 4 + 5] = {
    ...defaults,
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

  result[mapWidth * mapHeight - mapWidth] = {
    ...defaults,
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

  result[mapWidth * (mapHeight - 4) + 1] = {
    ...defaults,
    valueCountable: false,
    id: portal1id,
    type: 'portal',
    value: UNIT_MAX_VALUE,
    turrets: [],
    angle: 45,
    meta: {
      siblingId: portal2id,
    }
  }

  result[mapWidth * (mapHeight - 2) + 2] = {
    ...defaults,
    valueCountable: false,
    id: portal2id,
    type: 'portal',
    value: UNIT_MAX_VALUE,
    turrets: [],
    angle: -45,
    meta: {
      siblingId: portal1id,
    }
  }

  return result;
};


export default MAP_9x9_0;
