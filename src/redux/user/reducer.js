import { GET_USER } from './constants'

const initialState = {
  user: {
    id: 'temp',
    email: 'mail@mail.com',
    firstName: 'lorem',
    secondName: 'ipsum',
  },
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER : {
      return {
        ...state,
        user: action.payload,
      }
    }
    default:
      return state
  }
}

export default userReducer
