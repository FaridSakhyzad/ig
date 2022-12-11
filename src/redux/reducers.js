import { combineReducers } from 'redux';

import userReducer from './user/reducer';
import uiReducer from './ui/reducer';

const createReducer = () => combineReducers({
  user: userReducer,
  ui: uiReducer,
})

export default createReducer;
