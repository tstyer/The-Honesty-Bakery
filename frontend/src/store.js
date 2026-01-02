import { configureStore } from '@reduxjs/toolkit'
import { productListReducer, productDetailsReducer } from './reducers/productReducers'

const reducer = {
  productList: productListReducer,
  productDetails: productDetailsReducer,
}

const store = configureStore({
  reducer,
  devTools: process.env.NODE_ENV !== 'production',
})

export default store
