import { combineReducers } from 'redux';
import userReducer from './user/reducer';
import playgroundReducer from './playground/reducer';

const createReducer = () => combineReducers({
  user: userReducer,
  playground: playgroundReducer,
})

export default createReducer;
