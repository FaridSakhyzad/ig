import { SET_STASH } from './constants'

export const setStash = (data) => ({
  type: SET_STASH,
  payload: data,
})
