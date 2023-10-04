import { SET_EDITOR_MODE } from './constants';

const initialState = {
  editorMode: localStorage ? localStorage.getItem('editorMode') === 'true' : false,
  music: 100,
  sound: 100,
  vibration: true,
};

const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_EDITOR_MODE: {
      return {
        ...state,
        editorMode: action.payload,
      };
    }
    default:
      return state;
  }
};

export default settingsReducer;
