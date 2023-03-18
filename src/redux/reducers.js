import { combineReducers } from 'redux';
import userReducer from './user/reducer';

const createReducer = () => combineReducers({
  user: userReducer,
})

export default createReducer;
