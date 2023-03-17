import { SET_MODE } from './constants'

const initialState = {
  mode: 'gameplay'
}

const playgroundReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MODE : {
      console.log()
      return {
        ...state,
        mode: action.payload,
      }
    }
    default:
      return state
  }
}

export default playgroundReducer
