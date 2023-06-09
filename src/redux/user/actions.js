import {SET_SWAPS, SET_ROTATES, SET_AMMO, RESET_AMMO} from './constants'

export const setSwaps = (data) => ({
  type: SET_SWAPS,
  payload: data,
});

export const setRotates = (data) => ({
  type: SET_ROTATES,
  payload: data,
});

export const setAmmo = (data) => ({
  type: SET_AMMO,
  payload: data,
});

export const resetAmmo = () => ({
  type: RESET_AMMO,
})