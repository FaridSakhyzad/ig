import { combineReducers } from 'redux';
import uiReducer from './ui/reducer';
import userReducer from './user/reducer';
import userStashReducer from './userStash/reducer';

const createReducer = () => combineReducers({
  ui: uiReducer,
  user: userReducer,
  userStash: userStashReducer,
});

export default createReducer;
