import BaseUnit from 'units/BaseUnit';
// eslint-disable-next-line no-unused-vars
import TestUnitsSet1 from './test_units_set1';
import unitFactory from '../units/unitFactory';
import { GridCell } from '../GridCell';

const generateGrid = (gridWidth, gridHeight) => {
  const grid = [];

  for (let i = 0; i < gridHeight; i += 1) {
    for (let j = 0; j < gridWidth; j += 1) {
      const cell = new GridCell({
        left: j,
        top: i,
        offsetLeft: (j / gridWidth) * 100,
        offsetTop: (i / gridHeight) * 100,
      });

      grid.push(cell);
    }
  }

  return grid;
};

const generate2DPatch = (gridWidth, gridHeight) => {
  const patch = [];

  for (let i = 0; i < gridHeight; i += 1) {
    const row = [];

    for (let j = 0; j < gridWidth; j += 1) {
      row[j] = new GridCell({
        offsetLeft: (j / gridWidth) * 100,
        offsetTop: (i / gridHeight) * 100,
      });
    }

    patch.push(row);
  }

  return patch;
};

const generateRandomUnitsSet = (width, height, unitMinValue = 0, unitMaxValue = 4) => {
  const result = [];

  for (let i = 0; i < height; i += 1) {
    for (let j = 0; j < width; j += 1) {
      result.push(new BaseUnit(i, j, {
        value: Math.floor(Math.random() * (unitMaxValue - unitMinValue + 1) + unitMinValue),
      }));
    }
  }

  return result;
};

export class LevelMap {
  rescaleGrid(initialMapWidth, initialMapHeight) {
    let grid2D = [];

    let counter = 0;
    let row = [];

    this.grid.forEach((cell) => {
      row.push(cell);
      counter += 1;

      if (counter >= initialMapWidth) {
        grid2D.push(row);
        counter = 0;
        row = [];
      }
    });

    if (this.mapHeight > initialMapHeight) {
      const patch = generate2DPatch(grid2D[0].length, this.mapHeight - grid2D.length);
      grid2D = grid2D.concat(patch);
    }

    if (this.mapHeight < initialMapHeight) {
      grid2D = grid2D.slice(0, this.mapHeight);
    }

    if (this.mapWidth > initialMapWidth) {
      for (let i = 0; i < this.mapHeight; i += 1) {
        const patch = generate2DPatch(this.mapWidth - grid2D[i].length, 1)[0];
        grid2D[i] = grid2D[i].concat(patch);
      }
    }

    if (this.mapWidth < initialMapWidth) {
      for (let i = 0; i < this.mapHeight; i += 1) {
        grid2D[i] = grid2D[i].slice(0, this.mapWidth);
      }
    }

    if (this.mapWidth !== initialMapWidth || this.mapHeight !== initialMapHeight) {
      for (let i = 0; i < this.mapHeight; i += 1) {
        for (let j = 0; j < grid2D[i].length; j += 1) {
          grid2D[i][j].top = i;
          grid2D[i][j].left = j;

          grid2D[i][j].offsetTop = (i / grid2D.length) * 100;
          grid2D[i][j].offsetLeft = (j / grid2D[i].length) * 100;
        }
      }
    }

    const grid = [];

    for (let i = 0; i < grid2D.length; i += 1) {
      for (let j = 0; j < grid2D[i].length; j += 1) {
        grid.push(grid2D[i][j]);
      }
    }

    this.grid = grid;
  }

  constructor(params = {}, controls = {}) {
    const {
      id,
      name,
      index = 0,
      mapWidth = 9,
      mapHeight = 9,
      comboSequence = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55],
      reward = {
        userMoves: 1,

        defaults: 1,
        bobombs: 1,
        lasers: 1,
        deflectors: 0,
        walls: 0,
        npc: 0,
        hidden: 0,
        portals: 0,
        teleports: 0,

        swaps: 0,
        rotates: 0,
        jumps: 0,
        deletes: 0,
      },
      penalty = {
        userMoves: 0,

        defaults: 0,
        bobombs: 0,
        lasers: 0,
        deflectors: 0,
        walls: 0,
        npc: 0,
        hidden: 0,
        portals: 0,
        teleports: 0,

        swaps: 0,
        rotates: 0,
        jumps: 0,
        deletes: 0,
      },
      overrideUserAmmo = false,
      createUserBackup = false,
      restoreUserAmmo = false,
      ammo = {},
      ammoRestrictions = {},
      grid,
      units = [],
    } = params;

    const {
      generateRandomUnits = false,
    } = controls;

    this.name = name;
    this.index = index;
    this.id = id || Math.random().toString(16).substring(2);
    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;
    this.comboSequence = comboSequence;
    this.reward = reward;
    this.penalty = penalty;
    this.overrideUserAmmo = overrideUserAmmo;
    this.createUserBackup = createUserBackup;
    this.restoreUserAmmo = restoreUserAmmo;
    this.ammo = ammo;
    this.ammoRestrictions = ammoRestrictions;

    this.grid = grid || generateGrid(mapWidth, mapHeight);

    if (generateRandomUnits) {
      this.units = generateRandomUnitsSet(mapWidth, mapHeight);
    } else {
      this.units = units.map((unit) => {
        const { type, ...unitParams } = unit;

        return unitFactory(unit.type, unitParams);
      });
    }
  }
}

const mapSet = () => [
  new LevelMap({
    overrideUserAmmo: true,
    ammo: {
      userMoves: 1000,

      swaps: 10,
      rotates: 10,
      jumps: 10,
      deletes: 10,

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
    // units: TestUnitsSet1(9, 9),
  }, {
    generateRandomUnits: true,
  }),
  new LevelMap(),
  new LevelMap({
    mapWidth: 3,
    mapHeight: 3,
  }),
  /**/
  new LevelMap({
    mapWidth: 5,
    mapHeight: 5,
    comboSequence: [3, 5, 8, 13, 21, 34, 55],
    overrideUserAmmo: true,
    createUserBackup: true,
    ammo: {
      userMoves: 10,
      defaults: 100,
      bobombs: 0,
      lasers: 0,
      swaps: 0,
      rotates: 0,
      portals: 0,
      jumps: 0,
    },
    reward: {
      userMoves: 10,
      defaults: 10,
      bobombs: 10,
      lasers: 10,
      swaps: 10,
      rotates: 10,
      portals: 10,
      jumps: 10,
    },
  }),
  new LevelMap({
    mapWidth: 6,
    mapHeight: 6,
    comboSequence: [3, 5, 8, 13, 21, 34, 55],
    restoreUserAmmo: true,
    ammo: {},
    reward: {},
    penalty: {},
  }),
];
export default mapSet;
