import { SET_STASH } from './constants';

const initialState = {};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_STASH: {
      return {
        ...state,
        stash: action.payload,
      };
    }
    default:
      return state;
  }
};

export default userReducer;
