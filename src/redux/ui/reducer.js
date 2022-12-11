import { TOGGLE_LOGO } from './constants'

const initialState = {
  showLogo: true
}

const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_LOGO : {
      return {
        ...state,
        showLogo: action.payload,
      }
    }
    default:
      return state
  }
}

export default uiReducer
