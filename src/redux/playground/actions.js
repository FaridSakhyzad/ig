import { SET_MODE, SET_UNITS, SET_SELECTED_UNIT_ID } from './constants'

export const setMode = (data) => ({
  type: SET_MODE,
  payload: data
})

export const setUnits = (data) => ({
  type: SET_UNITS,
  payload: data
})

export const setSelectedUnitId = (data) => ({
  type: SET_SELECTED_UNIT_ID,
  payload: data
})
