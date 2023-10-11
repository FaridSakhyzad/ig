import {
  SET_EDITOR_MODE,
  SET_MUSIC,
  SET_SOUND,
  SET_VIBRATION,
} from './constants';

export const setEditorMode = (data) => ({
  type: SET_EDITOR_MODE,
  payload: data,
});

export const setMusic = (data) => ({
  type: SET_MUSIC,
  payload: data,
});

export const setSound = (data) => ({
  type: SET_SOUND,
  payload: data,
});

export const setVibration = (data) => ({
  type: SET_VIBRATION,
  payload: data,
});
