import {PROJECTILE_MOVE_DELAY, UNIT_MAX_VALUE, UNIT_MIN_VALUE} from '../config/config';
import { generateDefault, generateBobomb, generateLaser } from "../units";

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

  //*
  result[mapWidth * 6 + 3] = {
    ...generateDefault(),
    type: 'deflector',
    top: 6,
    left: 3,
    id: Math.random().toString(16).substring(2),
    turrets: [],
    value: 4,
    angle: -45,
  }

  result[mapWidth * 6 + 6] = {
    ...generateDefault(),
    top: 6,
    left: 6,
    id: Math.random().toString(16).substring(2),
    value: 4,
  }

  result[mapWidth * 4 + 0] = {
    ...generateDefault(),
    top: 4,
    left: 0,
    id: Math.random().toString(16).substring(2),
    turrets: [
      { name: 'turret1', angle: 90, type: 'default', speed: PROJECTILE_MOVE_DELAY, },
    ],
    value: UNIT_MAX_VALUE,
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

  result[mapWidth * 8 + 0] = {
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

  const portal1id = Math.random().toString(16).substring(2);
  const portal2id = Math.random().toString(16).substring(2);
  const portal3id = Math.random().toString(16).substring(2);

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
      exitPortalId: portal2id,
    }
  }

  result[mapWidth * 8 + 8] = {
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
      exitPortalId: portal3id,
    }
  }

  result[mapWidth * (mapHeight - 2) + 7] = {
    top: 7,
    left: 7,
    ...generateDefault(),
    valueCountable: false,
    id: portal3id,
    type: 'portal',
    value: UNIT_MAX_VALUE,
    turrets: [],
    angle: 270,
    meta: {
      exitPortalId: portal1id,
    }
  }


  const teleport1id = Math.random().toString(16).substring(2);
  const teleport2id = Math.random().toString(16).substring(2);

  result[mapWidth * 2 + 6] = {
    top: 2,
    left: 6,
    ...generateDefault(),
    valueCountable: false,
    id: teleport1id,
    type: 'teleport',
    value: UNIT_MAX_VALUE,
    turrets: [],
    angle: 0,
    meta: {
      exitTeleportId: teleport2id,
    }
  }

  result[mapWidth * 6 + 1] = {
    top: 6,
    left: 1,
    ...generateDefault(),
    valueCountable: false,
    id: teleport2id,
    type: 'teleport',
    value: UNIT_MAX_VALUE,
    turrets: [],
    angle: 0,
    meta: {
      exitTeleportId: teleport1id,
    }
  }

  result.splice(34, 1);
  //*/

  return result;
};


export default MAP_9x9_0;
