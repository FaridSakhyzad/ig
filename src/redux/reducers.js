import { combineReducers } from 'redux';
import userReducer from './user/reducer';
import uiReducer from "./ui/reducer";

const createReducer = () => combineReducers({
  ui: uiReducer,
  user: userReducer,
})

export default createReducer;
