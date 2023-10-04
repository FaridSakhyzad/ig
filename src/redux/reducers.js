import { combineReducers } from 'redux';
import uiReducer from './ui/reducer';
import userReducer from './user/reducer';
import userStashReducer from './userStash/reducer';
import settingsReducer from './settings/reducer';

const createReducer = () => combineReducers({
  ui: uiReducer,
  user: userReducer,
  settings: settingsReducer,
  userStash: userStashReducer,
});

export default createReducer;
