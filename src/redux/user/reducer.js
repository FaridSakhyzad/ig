import {
  SET_USER_MOVES,
  SET_SWAPS,
  SET_ROTATES,
  SET_AMMO,
  RESET_AMMO,
  SET_AVAILABLE_LEVELS, SET_CURRENT_LEVEL,
} from './constants';
import { getUserProfile } from '../../api/user';

const storedUserData = getUserProfile();

const initialState = {
  userMoves: 0,

  defaults: 0,
  bobombs: 0,
  lasers: 0,
  rails: 0,
  deflectors: 0,
  walls: 0,
  npc: 0,
  hidden: 0,
  portals: 0,
  teleports: 0,

  swaps: 0,
  rotates: 0,
  jumps: 0,
  deletes: 0,

  ammoRestrictions: {
    swaps: false,
    rotates: false,
    jumps: false,
    deletes: false,

    defaults: false,
    bobombs: false,
    lasers: false,
    rails: false,
    deflectors: false,
    walls: false,
    npc: false,
    hidden: false,
    portals: false,
    teleports: false,
  },

  currentLevelIndex: 0,
  availableLevels: [
    { index: 0 },
  ],

  ...storedUserData,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_MOVES: {
      return {
        ...state,
        userMoves: action.payload,
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
    case SET_AVAILABLE_LEVELS: {
      return {
        ...state,
        availableLevels: action.payload,
      };
    }
    case SET_CURRENT_LEVEL: {
      return {
        ...state,
        currentLevelIndex: action.payload,
      };
    }
    default:
      return state;
  }
};

export default userReducer;
