import { SET_MODE, SET_UNITS, SET_SELECTED_UNIT_ID } from './constants'

const initialState = {
  mode: 'gameplay',
  units: [],
  selectedUnitId: null,
}

const playgroundReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MODE: {
      return {
        ...state,
        mode: action.payload,
      }
    }
    case SET_UNITS: {
      return {
        ...state,
        units: action.payload,
      }
    }
    case SET_SELECTED_UNIT_ID: {
      return {
        ...state,
        selectedUnitId: action.payload,
      }
    }
    default:
      return state
  }
}

export default playgroundReducer
