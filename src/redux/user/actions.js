import {
  SET_USER_MOVES,
  SET_SWAPS,
  SET_ROTATES,
  SET_AMMO,
  RESET_AMMO,
  SET_EDITOR_MODE,
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

export const setEditorMode = (data) => ({
  type: SET_EDITOR_MODE,
  payload: data,
});
