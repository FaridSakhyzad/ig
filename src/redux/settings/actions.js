import { SET_EDITOR_MODE } from './constants';

export const setEditorMode = (data) => ({
  type: SET_EDITOR_MODE,
  payload: data,
});
