import { configureStore } from '@reduxjs/toolkit';
import createReducer from './reducers';

const store = configureStore({
  reducer: createReducer(),
});

export default store;
