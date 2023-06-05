import { SET_SWAPS, SET_ROTATES, SET_AMMO } from './constants'

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
})