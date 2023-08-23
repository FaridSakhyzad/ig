import { SET_CURRENT_SCREEN } from './constants';

export const setCurrentScreen = (data) => ({
  type: SET_CURRENT_SCREEN,
  payload: data,
});
