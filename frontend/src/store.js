import { configureStore } from '@reduxjs/toolkit'

// PRODUCT REDUCERS
import {
  productListReducer,
  productDetailsReducer,
  productDeleteReducer,
  productCreateReducer,
  productUpdateReducer,
} from './reducers/productReducers'

// CART REDUCER
import { cartReducer } from './reducers/cartReducers'

// ORDER REDUCER
import { orderListReducer } from './reducers/orderReducers'

// USER REDUCERS
import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
  userListReducer,
} from './reducers/userReducers'

const reducer = {
  productList: productListReducer,
  productDetails: productDetailsReducer,
  productDelete: productDeleteReducer,
  productCreate: productCreateReducer,
  productUpdate: productUpdateReducer,

  cart: cartReducer,

  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userList: userListReducer,

  orderList: orderListReducer,
}

const safeParse = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
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
