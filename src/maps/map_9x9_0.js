import {PROJECTILE_MOVE_DELAY, UNIT_MAX_VALUE, UNIT_MIN_VALUE} from '../config/config';
import { generateDefault, generateBobomb, generateLaser } from "../units";

const MAP_9x9_0 = (mapWidth, mapHeight) => {
  const result = [];

  for (let i = 0; i < mapHeight; i++) {
    for (let j = 0; j < mapWidth; j++) {
      result.push({
        ...generateDefault(i, j, {
          value: 0 * Math.pow(Math.floor(Math.random() * (UNIT_MAX_VALUE - UNIT_MIN_VALUE + 1) + UNIT_MIN_VALUE), 0)
        })
      });
    }
  }

  //*
  result[mapWidth * 6 + 3] = {
    ...generateDefault(6, 3),
    type: 'deflector',
    turrets: [],
    value: 4,
    angle: -45,
  }

  result[mapWidth * 6 + 6] = {
    ...generateDefault(6, 6),
    value: 4,
  }

  result[mapWidth * 4 + 0] = {
    ...generateDefault(4, 0),
    turrets: [
      { name: 'turret1', angle: 90, type: 'default', speed: PROJECTILE_MOVE_DELAY, },
    ],
    value: UNIT_MAX_VALUE,
  }

  result[mapWidth * 1 + 3] = {
    ...generateDefault(1, 3),
    id: Math.random().toString(16).substring(2),
    type: 'wall',
    kind: 'stone',
    valueCountable: false,
    value: UNIT_MAX_VALUE,
  }

  result[mapWidth * 2] = {
    ...generateDefault(2, 0),
    id: Math.random().toString(16).substring(2),
    type: 'npc',
    selectable: false,
    value: UNIT_MAX_VALUE,
  }

  result[mapWidth * 2 + 3] = {
    ...generateDefault(2, 3),
    id: Math.random().toString(16).substring(2),
    type: 'wall',
    kind: 'wood',
    valueCountable: false,
    value: UNIT_MAX_VALUE,
  }

  result[mapWidth * 1 + 4] = {
    ...generateDefault(1, 4),
    type: 'hidden',
    value: UNIT_MAX_VALUE,
  }

  result[mapWidth * 2 + 2] = {
    ...generateBobomb(2, 2),
  }

  result[mapWidth * 3 + 3] = {
    ...generateDefault(3, 3, {
      value: 1
    }),
  }

  result[mapWidth * 3 + 5] = {
    ...generateLaser(3, 5),
  }

  result[mapWidth * 4 + 3] = {
    ...generateDefault(4, 3),
    value: 1,
  }

  result[mapWidth * 4 + 5] = {
    ...generateLaser(4, 5),
  };

  result[mapWidth * 8 + 0] = {
    ...generateLaser(8, 0),
  }

  result[44] = {
    ...generateDefault(4, 8, {
      value: UNIT_MAX_VALUE,
      turrets: [
        { name: 'turret1', angle: 0, type: 'default', speed: PROJECTILE_MOVE_DELAY, },
        { name: 'turret2', angle: 180, type: 'default', speed: PROJECTILE_MOVE_DELAY, },
      ]
    })
  }

  const portal1id = Math.random().toString(16).substring(2);
  const portal2id = Math.random().toString(16).substring(2);
  const portal3id = Math.random().toString(16).substring(2);

  result[8] = {
    ...generateDefault(0, 8),
    valueCountable: false,
    id: portal1id,
    type: 'portal',
    value: UNIT_MAX_VALUE,
    angle: 180,
    meta: {
      exitPortalId: portal2id,
    }
  }

  result[mapWidth * 8 + 8] = {
    ...generateDefault(8, 8),
    valueCountable: false,
    id: portal2id,
    type: 'portal',
    value: UNIT_MAX_VALUE,
    angle: 0,
    meta: {
      exitPortalId: portal3id,
    }
  }

  result[mapWidth * 7 + 7] = {
    ...generateDefault(7, 7),
    valueCountable: false,
    id: portal3id,
    type: 'portal',
    value: UNIT_MAX_VALUE,

    angle: 270,
    meta: {
      exitPortalId: portal1id,
    }
  }


  const teleport1id = Math.random().toString(16).substring(2);
  const teleport2id = Math.random().toString(16).substring(2);

  result[mapWidth * 2 + 6] = {
    ...generateDefault(2, 6),
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
    ...generateDefault(6, 1),
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
