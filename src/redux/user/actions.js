import { GET_USER } from './constants'

export const getUser = (data) => ({
  type: GET_USER,
  payload: data
})
