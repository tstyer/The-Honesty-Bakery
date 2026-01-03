import { CART_ADD_ITEM, CART_REMOVE_ITEM } from '../constants/cartConstants'

export const cartReducer = (state = { cartItems: [] }, action) => {
    switch (action.type) {
        case CART_ADD_ITEM:
            // payload is item
            const item = action.payload
            // Check if item already exists in cart
            const existItem = state.cartItems.find(x => x.product === item.product)

            if (existItem) {
                return {
                    ...state, /* state returns original version, but everything after is added or amends. */
                    cartItems: state.cartItems.map(x => x.product === existItem.product ? item : x)
                }
            } else {
                return {
                    ...state,
                    cartItems: [...state.cartItems, item]
                }
            }

        
        case CART_REMOVE_ITEM:
            return {
                ...state,
                /* filster will just keep every product that doesn't match the id (action.payload) */
                cartItems: state.cartItems.filter(x => x.product !== action.payload)
            } 
            
        default:
            return state
    }
}