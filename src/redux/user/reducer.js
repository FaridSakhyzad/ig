import {
  SET_MOVES, SET_SWAPS, SET_ROTATES, SET_AMMO, RESET_AMMO, SET_STASH,
} from './constants';

const initialState = {
  moves: 0,
  swaps: 0,
  rotates: 0,
  jumps: 0,

  defaults: 0,
  bobombs: 0,
  lasers: 0,
  deflectors: 0,
  walls: 0,
  npc: 0,
  hidden: 0,
  portals: 0,
  teleports: 0,

  ammoRestrictions: {
    moves: false,
    swaps: false,
    rotates: false,
    jumps: false,

    defaults: false,
    bobombs: false,
    lasers: false,
    deflectors: false,
    walls: false,
    npc: false,
    hidden: false,
    portals: false,
    teleports: false,
  },
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MOVES: {
      return {
        ...state,
        moves: action.payload,
      };
    }
    case SET_SWAPS: {
      return {
        ...state,
        swaps: action.payload,
      };
    }
    case SET_ROTATES: {
      return {
        ...state,
        rotates: action.payload,
      };
    }
    case SET_AMMO: {
      return {
        ...state,
        ...action.payload,
      };
    }
    case RESET_AMMO: {
      return {
        ...initialState,
      };
    }
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
