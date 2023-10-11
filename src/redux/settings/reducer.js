import {
  SET_EDITOR_MODE,
  SET_MUSIC,
  SET_SOUND,
  SET_VIBRATION,
} from './constants';
import { getSettings } from '../../api/settings';

const storedSettingsData = getSettings();

const initialState = {
  editorMode: localStorage ? localStorage.getItem('editorMode') === 'true' : false,
  music: 1,
  sound: 1,
  vibration: true,

  ...storedSettingsData,
};

const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_EDITOR_MODE: {
      return {
        ...state,
        editorMode: action.payload,
      };
    }
    case SET_MUSIC: {
      return {
        ...state,
        music: action.payload,
      };
    }
    case SET_SOUND: {
      return {
        ...state,
        sound: action.payload,
      };
    }
    case SET_VIBRATION: {
      return {
        ...state,
        vibration: action.payload,
      };
    }
    default:
      return state;
  }
};

export default settingsReducer;
