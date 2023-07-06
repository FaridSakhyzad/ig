import MAP_9x9_0 from './map_9x9_0';
import { PROJECTILE_MOVE_DELAY } from '../config/config';

const defaults = {
  type: 'default',
  minValue: 0,
  maxValue: 4,
  valueCountable: true,
  angle: 0,
  selectable: true,
  turrets: [
    { name: 'turret1', angle: 0, type: 'default', speed: PROJECTILE_MOVE_DELAY, },
    { name: 'turret2', angle: 90, type: 'default', speed: PROJECTILE_MOVE_DELAY, },
    { name: 'turret3', angle: 180, type: 'default', speed: PROJECTILE_MOVE_DELAY, },
    { name: 'turret4', angle: 270, type: 'default', speed: PROJECTILE_MOVE_DELAY, }
  ],
}

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

  grid[1][1].type = 'grass';
  grid[2][2].type = 'water';

  return grid;
};

const mapSet = () => [
  {
    mapWidth: 9,
    mapHeight: 9,
    comboSequence: [1, 1, 1, 3, 5, 8, 13, 21, 34, 55],
    reward: {
      moves: 1,
      defaults: 1,
      bobombs: 1,
      lasers: 1,
    },
    penalty: {} || {
      jumps: 1,
      swaps: 1,
      rotates: 1,
    },
    ammo: {
      moves: 100,
      defaults: 1,
      bobombs: 1,
      lasers: 1,
      swaps: 1,
      rotates: 1,
      portals: 1,
      jumps: 1,
    },
    units: MAP_9x9_0(9, 9),
    grid: generateGrid(9, 9),
  },
  {
    mapWidth: 9,
    mapHeight: 9,
    comboSequence: [3, 5, 8, 13, 21, 34, 55],
    overrideUserAmmo: true,
    ammo: {
      moves: 100,
      defaults: 100,
      bobombs: 100,
      lasers: 100,
      swaps: 100,
      rotates: 100,
      portals: 100,
      jumps: 100,
    },
    reward: {
      moves: 1,
      defaults: 1,
      bobombs: 1,
      lasers: 1,
    },
    units: ((width, height) => {
      const UNIT_MIN_VALUE = 0
      const UNIT_MAX_VALUE = 4;

      const result = [];

      for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
          result.push({
            ...defaults,
            top: i,
            left: j,
            id: Math.random().toString(16).substring(2),
            value: Math.floor(Math.random() * (UNIT_MAX_VALUE - UNIT_MIN_VALUE + 1) + UNIT_MIN_VALUE),
          });
        }
      }

      return result;
    })(9, 9),
    grid: generateGrid(9, 9),
  },
  {
    mapWidth: 3,
    mapHeight: 3,
    comboSequence: [3, 5, 8, 13, 21, 34, 55],
    restoreUserAmmo: true,
    ammo: {},
    reward: {},
    penalty: {},
    units: ((width, height) => {
      const UNIT_MIN_VALUE = 0
      const UNIT_MAX_VALUE = 4;

      const result = [];

      for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
          result.push({
            ...defaults,
            top: i,
            left: j,
            id: Math.random().toString(16).substring(2),
            value: Math.pow(Math.floor(Math.random() * (UNIT_MAX_VALUE - UNIT_MIN_VALUE + 1) + UNIT_MIN_VALUE), 0),
          });
        }
      }

      return result;
    })(3, 3),
    grid: generateGrid(3, 3),
  },
  {
    mapWidth: 5,
    mapHeight: 5,
    comboSequence: [3, 5, 8, 13, 21, 34, 55],
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
    penalty: {},
    units: ((width, height) => {
      const UNIT_MIN_VALUE = 0
      const UNIT_MAX_VALUE = 4;

      const result = [];

      for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
          result.push({
            ...defaults,
            top: i,
            left: j,
            id: Math.random().toString(16).substring(2),
            value: Math.pow(Math.floor(Math.random() * (UNIT_MAX_VALUE - UNIT_MIN_VALUE + 1) + UNIT_MIN_VALUE), 0),
          });
        }
      }

      return result;
    })(5, 5),
    grid: generateGrid(5, 5),
  },
  {
    mapWidth: 6,
    mapHeight: 6,
    comboSequence: [3, 5, 8, 13, 21, 34, 55],
    ammo: {},
    reward: {},
    penalty: {},
    units: ((width, height) => {
      const UNIT_MIN_VALUE = 0
      const UNIT_MAX_VALUE = 4;

      const result = [];

      for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
          result.push({
            ...defaults,
            top: i,
            left: j,
            id: Math.random().toString(16).substring(2),
            value: 4 * Math.pow(Math.floor(Math.random() * (UNIT_MAX_VALUE - UNIT_MIN_VALUE + 1) + UNIT_MIN_VALUE), 0),
          });
        }
      }

      return result;
    })(6, 6),
    grid: generateGrid(6, 6),
  },
]
export default mapSet;


