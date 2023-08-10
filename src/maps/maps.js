import TestUnitsSet1 from './test_units_set1';
import { BaseUnit } from "../units";

const generateGrid = (gridWidth, gridHeight) => {
  const grid = [];

  for (let i = 0; i < gridHeight; ++i) {
    const row = [];

    for (let j = 0; j < gridWidth; ++j) {
      row[j] = {
        id: Math.random().toString(16).substring(2),
        left: j / gridWidth * 100,
        top: i / gridHeight * 100,
        type: 'turf',
      };
    }

    grid.push(row);
  }

  return grid;
};

const generateRandomUnitsSet = (width, height, unitMinValue = 0, unitMaxValue = 4) => {
  const result = [];

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      result.push(new BaseUnit(i, j, {
        value: Math.floor(Math.random() * (unitMaxValue - unitMinValue + 1) + unitMinValue)
      }));
    }
  }

  return result;
}

const defaults = {
  mapWidth: 9,
  mapHeight: 9,
  comboSequence: [1, 1, 2, 3, 5, 8, 13, 21, 34, 55],
  overrideUserAmmo: false,
  createUserBackup: false,
  ammo: {},
  reward: {
    moves: 1,
    defaults: 1,
    bobombs: 1,
    lasers: 1,
  },
  penalty: {},
}

class Map {
  constructor(params = {}) {
    const {
      mapWidth,
      mapHeight,
      comboSequence,
      reward,
      penalty,
      overrideUserAmmo,
      ammo,
      ammoRestrictions = {},
      grid,
      units,
    } = {
      ...defaults,
      ...params
    };

    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;
    this.comboSequence = comboSequence;
    this.reward = reward;
    this.penalty = penalty;
    this.overrideUserAmmo = overrideUserAmmo;
    this.ammo = ammo;
    this.ammoRestrictions = ammoRestrictions;

    this.grid = grid || generateGrid(mapWidth, mapHeight);
    this.units = units || generateRandomUnitsSet(mapWidth, mapHeight);
  }
}

const mapSet = () => [
  new Map({
    overrideUserAmmo: true,
    ammo: {
      moves: 1000,
      swaps: 10,
      rotates: 10,
      jumps: 10,

      defaults: 1,
      bobombs: 1,
      lasers: 1,
      deflectors: 1,
      walls: 1,
      npc: 1,
      hidden: 1,
      portals: 1,
      teleports: 1,
    },
    units: TestUnitsSet1(9, 9)
  }),
  new Map(),
  new Map({
    mapWidth: 3,
    mapHeight: 3,
  }),

  new Map({
    mapWidth: 5,
    mapHeight: 5,
    comboSequence: [3, 5, 8, 13, 21, 34, 55],
    overrideUserAmmo: true,
    createUserBackup: false,
    ammo: {
      moves: 10,
      defaults: 0,
      bobombs: 0,
      lasers: 0,
      swaps: 0,
      rotates: 0,
      portals: 0,
      jumps: 0,
    },
    reward: {
      moves: 10,
      defaults: 10,
      bobombs: 10,
      lasers: 10,
      swaps: 10,
      rotates: 10,
      portals: 10,
      jumps: 10,
    },
  }),
  new Map({
    mapWidth: 6,
    mapHeight: 6,
    comboSequence: [3, 5, 8, 13, 21, 34, 55],
    restoreUserAmmo: true,
    ammo: {},
    reward: {},
    penalty: {},
  }),
]
export default mapSet;
