import { configureStore, combineReducers, applyMiddleware } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'
import { composeWithDevTools } from '@redux-devtools/extension'

const reducer = combineReducers({})

const initialState = {}

const applyMiddleware = [thunk]

const store = configureStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))

export default store