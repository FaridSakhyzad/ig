import { SET_MOVES, SET_SWAPS, SET_ROTATES, SET_AMMO, RESET_AMMO, SET_STASH } from './constants'
import mapSet from "../../maps/maps";

const { ammo } = mapSet()[0];

const initialState = {
  ...ammo
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MOVES: {
      return {
        ...state,
        moves: action.payload,
      }
    }
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
    case SET_STASH: {
      return {
        ...state,
        stash: action.payload,
      }
    }
    default:
      return state
  }
}

export default userReducer
