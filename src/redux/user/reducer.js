import { SET_SWAPS, SET_ROTATES, SET_AMMO, RESET_AMMO } from './constants'

const initialState = {
  moves: 10,

  defaults: 1,
  bobombs: 1,
  lasers: 1,

  swaps: 1,
  rotates: 1,
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SWAPS: {
      return {
        ...state,
        swaps: action.payload,
      }
    }
    case SET_ROTATES: {
      return {
        ...state,
        rotates: action.payload,
      }
    }
    case SET_AMMO: {
      return {
        ...state,
        ...action.payload,
      }
    }
    case RESET_AMMO: {
      return {
        ...initialState,
      }
    }
    default:
      return state
  }
}

export default userReducer
