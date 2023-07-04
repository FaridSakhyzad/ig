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

const mapSet = () => [
  {
    gridWidth: 9,
    gridHeight: 9,
    mapWidth: 9,
    mapHeight: 9,
    comboSequence: [1, 1, 1, 3, 5, 8, 13, 21, 34, 55],
    ammo: {
      moves: 100,
      defaults: 100,
      bobombs: 100,
      lasers: 100,
      swaps: 100,
      rotates: 100,
      portals: 100,
    },
    units: MAP_9x9_0(9, 9)
  },
  {
    gridWidth: 9,
    gridHeight: 9,
    mapWidth: 9,
    mapHeight: 9,
    comboSequence: [3, 5, 8, 13, 21, 34, 55],
    ammo: {
      moves: 100,
      defaults: 100,
      bobombs: 100,
      lasers: 100,
      swaps: 100,
      rotates: 100,
      portals: 100,
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
  },
  {
    gridWidth: 9,
    gridHeight: 9,
    mapWidth: 3,
    mapHeight: 3,
    comboSequence: [3, 5, 8, 13, 21, 34, 55],
    ammo: {
      moves: 100,
      defaults: 100,
      bobombs: 100,
      lasers: 100,
      swaps: 100,
      rotates: 100,
      portals: 100,
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
            value: Math.pow(Math.floor(Math.random() * (UNIT_MAX_VALUE - UNIT_MIN_VALUE + 1) + UNIT_MIN_VALUE), 0),
          });
        }
      }

      return result;
    })(3, 3),
  },
  {
    gridWidth: 9,
    gridHeight: 9,
    mapWidth: 5,
    mapHeight: 5,
    comboSequence: [3, 5, 8, 13, 21, 34, 55],
    ammo: {
      moves: 100,
      defaults: 100,
      bobombs: 100,
      lasers: 100,
      swaps: 100,
      rotates: 100,
      portals: 100,
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
            value: Math.pow(Math.floor(Math.random() * (UNIT_MAX_VALUE - UNIT_MIN_VALUE + 1) + UNIT_MIN_VALUE), 0),
          });
        }
      }

      return result;
    })(5, 5),
  },
]
export default mapSet;


