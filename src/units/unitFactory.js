import BaseUnit from './BaseUnit';
import Bobomb from './Bobomb';
import Laser from './Laser';
import Deflector from './Deflector';
import Wall from './Wall';
import Npc from './Npc';
import Hidden from './Hidden';
import Portal from './Portal';
import Teleport from './Teleport';

const constructorsMap = {
  default: BaseUnit,
  bobomb: Bobomb,
  laser: Laser,
  deflector: Deflector,
  wall: Wall,
  npc: Npc,
  hidden: Hidden,
  portal: Portal,
  teleport: Teleport,
};

export default function unitFactory(unitType, data) {
  const Constructor = constructorsMap[unitType];

  const { top, left, ...unitParams } = data;

  return new Constructor(top, left, unitParams);
}

export const generatePortals = (top1, left1, top2, left2) => {
  const portal1 = new Portal(top1, left1);
  const portal2 = new Portal(top2, left2, { angle: 180 });

  portal1.setExitPortalId(portal2.id);
  portal2.setExitPortalId(portal1.id);

  return [portal1, portal2];
};

export const generateTeleports = (top1, left1, top2, left2) => {
  const teleport1 = new Teleport(top1, left1);
  const teleport2 = new Teleport(top2, left2);

  teleport1.setExitTeleportId(teleport2.id);
  teleport2.setExitTeleportId(teleport1.id);

  return [teleport1, teleport2];
};
