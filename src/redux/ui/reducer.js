import { SET_CURRENT_SCREEN } from './constants'
import { SCREEN_MODES } from "../../config/config";

const initialState = {
  currentScreen: SCREEN_MODES.playground,
}

const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_SCREEN : {
      return {
        ...state,
        currentScreen: action.payload,
      }
    }
    default:
      return state
  }
}

export default uiReducer;
