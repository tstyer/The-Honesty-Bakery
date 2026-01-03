import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
} from '../constants/userConstants'

export const userLoginReducer = (state = { userInfo: null }, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { ...state, loading: true, error: null }
    case USER_LOGIN_SUCCESS:
      return { loading: false, userInfo: action.payload, error: null }
    case USER_LOGIN_FAIL:
      return { ...state, loading: false, error: action.payload }
    case USER_LOGOUT:
      return { userInfo: null }
    default:
      return state
  }
}

export const userRegisterReducer = (state = { userInfo: null }, action) => {
  switch (action.type) {
    case USER_REGISTER_REQUEST:
      return { ...state, loading: true, error: null }
    case USER_REGISTER_SUCCESS:
      return { loading: false, userInfo: action.payload, error: null }
    case USER_REGISTER_FAIL:
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}
