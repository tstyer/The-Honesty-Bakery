import axios from 'axios'
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  USER_DETAILS_RESET,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
} from '../constants/userConstants'

// Helper - error messages
const getErrorMessage = (error) =>
  error?.response?.data?.detail ||
  error?.response?.data?.message ||
  error?.message ||
  'Something went wrong'

// LOGIN
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST })

    const config = { headers: { 'Content-Type': 'application/json' } }

    const { data } = await axios.post(
      '/api/users/login/',
      { email, password },
      config
    )

    dispatch({ type: USER_LOGIN_SUCCESS, payload: data })
    localStorage.setItem('userInfo', JSON.stringify(data))
  } catch (error) {
    dispatch({ type: USER_LOGIN_FAIL, payload: getErrorMessage(error) })
  }
}

// LOGOUT
export const logout = () => (dispatch) => {
  localStorage.removeItem('userInfo')
  dispatch({ type: USER_LOGOUT })
  dispatch({ type: USER_DETAILS_RESET })
}

// REGISTER (and auto-login like the course)
export const register = (name, email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST })

    const config = { headers: { 'Content-Type': 'application/json' } }

    // NOTE: This endpoint must exist in your backend
    // Usually POST /api/users/ creates a user
    const { data } = await axios.post(
      '/api/users/',
      { name, email, password },
      config
    )

    dispatch({ type: USER_REGISTER_SUCCESS, payload: data })
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data })
    localStorage.setItem('userInfo', JSON.stringify(data))
  } catch (error) {
    dispatch({ type: USER_REGISTER_FAIL, payload: getErrorMessage(error) })
  }
}

// GET USER PROFILE 
export const getUserDetails = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DETAILS_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    const accessToken = userInfo?.token || userInfo?.access

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }

    const { data } = await axios.get('/api/users/profile/', config)

    dispatch({ type: USER_DETAILS_SUCCESS, payload: data })
  } catch (error) {
    dispatch({ type: USER_DETAILS_FAIL, payload: getErrorMessage(error) })
  }
}


// UPDATE PROFILE
export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_UPDATE_PROFILE_REQUEST })

    const {
      userLogin: { userInfo },
    } = getState()

    const accessToken = userInfo?.token || userInfo?.access
    if (!accessToken) {
      throw new Error('Not logged in (missing token). Please log in again.')
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }

    const { data } = await axios.put('/api/users/update/', user, config)

    dispatch({ type: USER_UPDATE_PROFILE_SUCCESS, payload: data })

    dispatch({ type: USER_LOGIN_SUCCESS, payload: data })
    localStorage.setItem('userInfo', JSON.stringify(data))
  } catch (error) {
    dispatch({ type: USER_UPDATE_PROFILE_FAIL, payload: getErrorMessage(error) })
  }
}

