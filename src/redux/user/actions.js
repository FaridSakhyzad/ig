import {
  SET_USER_MOVES,
  SET_SWAPS,
  SET_ROTATES,
  SET_AMMO,
  RESET_AMMO,
  SET_AVAILABLE_LEVELS,
  SET_CURRENT_LEVEL,
} from './constants';

export const setUserMoves = (data) => ({
  type: SET_USER_MOVES,
  payload: data,
});

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
});

export const setAvailableLevels = (data) => ({
  type: SET_AVAILABLE_LEVELS,
  payload: data,
});

export const setCurrentLevel = (data) => ({
  type: SET_CURRENT_LEVEL,
  payload: data,
});
