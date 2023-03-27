import MAP_9x9_0 from './map_9x9_0';
import { PROJECTILE_MOVE_DELAY } from '../config/config';

const defaults = {
  type: 'default',
  minValue: 0,
  maxValue: 4,
  valueCountable: true,
  angle: 0,
  turrets: [
    { name: 'turret1', angle: 0, type: 'default', speed: PROJECTILE_MOVE_DELAY, },
    { name: 'turret2', angle: 90, type: 'default', speed: PROJECTILE_MOVE_DELAY, },
    { name: 'turret3', angle: 180, type: 'default', speed: PROJECTILE_MOVE_DELAY, },
    { name: 'turret4', angle: 270, type: 'default', speed: PROJECTILE_MOVE_DELAY, }
  ],
}

const mapSet = [
  {
    mapWidth: 9,
    mapHeight: 9,
    units: MAP_9x9_0
  },
  {
    mapWidth: 3,
    mapHeight: 3,
    units: ((m, n) => {
      const UNIT_MIN_VALUE = 0
      const UNIT_MAX_VALUE = 4;

      const result = [];

      for (let i = 0; i < m * n; i++) {
        result.push({
          ...defaults,
          id: Math.random().toString(16).substring(2),
          value: Math.pow(Math.floor(Math.random() * (UNIT_MAX_VALUE - UNIT_MIN_VALUE + 1) + UNIT_MIN_VALUE), 0),
        });
      }

      return result;
    })(3, 3),
  },
  {
    mapWidth: 5,
    mapHeight: 5,
    units: ((width, height) => {
      const UNIT_MIN_VALUE = 0
      const UNIT_MAX_VALUE = 4;

      const result = [];

      for (let i = 0; i < width * height; i++) {
        result.push({
          ...defaults,
          id: Math.random().toString(16).substring(2),
          value: Math.pow(Math.floor(Math.random() * (UNIT_MAX_VALUE - UNIT_MIN_VALUE + 1) + UNIT_MIN_VALUE), 0),
        });
      }

      return result;
    })(5, 5),
  },
]
export default mapSet;


