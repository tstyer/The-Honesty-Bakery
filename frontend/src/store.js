import { configureStore } from '@reduxjs/toolkit'
import { productListReducer, productDetailsReducer } from './reducers/productReducers'
import { cartReducer } from './reducers/cartReducers'
import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
} from './reducers/userReducers'

const reducer = {
  productList: productListReducer,
  productDetails: productDetailsReducer,
  cart: cartReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
}

const safeParse = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch (e) {
    return fallback
  }
}

const cartItemsFromStorage = safeParse('cartItems', [])
const userInfoFromStorage = safeParse('userInfo', null)
const paymentResultFromStorage = safeParse('paymentResult', null)

const paymentMethodFromStorage = localStorage.getItem('paymentMethod') || ''

const initialState = {
  cart: {
    cartItems: cartItemsFromStorage,
    paymentMethod: paymentMethodFromStorage,
    paymentResult: paymentResultFromStorage,
  },
  userLogin: { userInfo: userInfoFromStorage },
}

const store = configureStore({
  reducer,
  preloadedState: initialState,
  devTools: process.env.NODE_ENV !== 'production',
})

export default store
