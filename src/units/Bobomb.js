import BaseUnit from './BaseUnit';

export default class Bobomb extends BaseUnit {
  constructor(top, left, params) {
    super(top, left, {
      turrets: [
        {
          name: 'turret1',
          angle: 0,
          type: 'bobomb',
          maxDistance: 39,
          speed: 15,
        },
        {
          name: 'turret2',
          angle: 45,
          type: 'bobomb',
          maxDistance: 39 * 1.4142135623730951,
          speed: 15 / 1.4142135623730951,
        },
        {
          name: 'turret3',
          angle: 90,
          type: 'bobomb',
          maxDistance: 39,
          speed: 15,
        },
        {
          name: 'turret4',
          angle: 135,
          type: 'bobomb',
          maxDistance: 39 * 1.4142135623730951,
          speed: 15 / 1.4142135623730951,
        },
        {
          name: 'turret5',
          angle: 180,
          type: 'bobomb',
          maxDistance: 39,
          speed: 15,
        },
        {
          name: 'turret6',
          angle: 225,
          type: 'bobomb',
          maxDistance: 39 * 1.4142135623730951,
          speed: 15 / 1.4142135623730951,
        },
        {
          name: 'turret7',
          angle: 270,
          type: 'bobomb',
          maxDistance: 39,
          speed: 15,
        },
        {
          name: 'turret8',
          angle: 315,
          type: 'bobomb',
          maxDistance: 39 * 1.4142135623730951,
          speed: 15 / 1.4142135623730951,
        },
      ],
      ...params,
      type: 'bobomb',
    });
  }
}
