import { PROJECTILE_MOVE_DELAY, UNIT_MAX_VALUE } from '../config/config';
import {
  BaseUnit,
  Bobomb,
  Laser,
  Deflector,
  Wall,
  Npc,
  Hidden,
  Portal,
  Teleport,
} from '../units';

const TestUnitsSet1 = (mapWidth, mapHeight) => {
  const result = [];

  for (let i = 0; i < mapHeight; i += 1) {
    for (let j = 0; j < mapWidth; j += 1) {
      // result.push(new BaseUnit(i, j));
    }
  }

  //*
  result[mapWidth * 6 + 3] = new Deflector(6, 3, {
    angle: -45,
  });

  result[mapWidth * 6 + 6] = new BaseUnit(6, 6, { value: 4 });

  result[mapWidth * 4 + 0] = new BaseUnit(4, 0, {
    value: UNIT_MAX_VALUE,
    turrets: [
      {
        name: 'turret1', angle: 90, type: 'default', speed: PROJECTILE_MOVE_DELAY,
      },
    ],
  });

  result[mapWidth * 1 + 3] = new Wall(1, 3);

  result[mapWidth * 2 + 3] = new Wall(2, 3, {
    kind: 'wood',
  });

  result[mapWidth * 2 + 0] = new Npc(2, 0);

  result[mapWidth * 1 + 4] = new Hidden(1, 4);

  result[mapWidth * 2 + 2] = new Bobomb(2, 2, { value: UNIT_MAX_VALUE });

  result[mapWidth * 3 + 3] = new BaseUnit(3, 3, { value: 1 });

  result[mapWidth * 3 + 5] = new Laser(3, 5, { value: UNIT_MAX_VALUE });

  result[mapWidth * 4 + 3] = new BaseUnit(4, 3, { value: 1 });

  result[mapWidth * 4 + 5] = new Laser(4, 5, { value: UNIT_MAX_VALUE });

  result[mapWidth * 8 + 0] = new Laser(8, 0, { value: UNIT_MAX_VALUE });

  result[mapWidth * 4 + 8] = new BaseUnit(4, 8, {
    value: UNIT_MAX_VALUE,
    turrets: [
      {
        name: 'turret1', angle: 0, type: 'default', speed: PROJECTILE_MOVE_DELAY,
      },
      {
        name: 'turret2', angle: 180, type: 'default', speed: PROJECTILE_MOVE_DELAY,
      },
    ],
  });

  const portal1 = new Portal(0, 8, { angle: 180 });
  const portal2 = new Portal(8, 8, {});
  const portal3 = new Portal(7, 7, { angle: 270 });

  portal1.setExitPortalId(portal2.id);
  portal2.setExitPortalId(portal3.id);
  portal3.setExitPortalId(portal1.id);

  result[mapWidth * 0 + 8] = portal1;

  result[mapWidth * 8 + 8] = portal2;

  result[mapWidth * 7 + 7] = portal3;

  const teleport1 = new Teleport(2, 6);
  const teleport2 = new Teleport(6, 1);

  teleport1.setExitTeleportId(teleport2.id);
  teleport2.setExitTeleportId(teleport1.id);

  result[mapWidth * 2 + 6] = teleport1;
  result[mapWidth * 6 + 1] = teleport2;

  result.splice(34, 1);
  //* /

  return result.filter(Boolean);
};

export default TestUnitsSet1;
