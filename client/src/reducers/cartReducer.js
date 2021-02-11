import { CART_ADD_ITEM, CART_REMOVE_ITEM } from '../constants/cartConstants';

export const cartReducer = (state = { shoppingCart: [] }, action) => {
  switch (action.type) {
    case CART_ADD_ITEM:
      const item = action.payload;
      const existItem = state.shoppingCart.find(
        (x) => x.product === item.product
      );
      if (existItem) {
        return {
          ...state,
          shoppingCart: state.shoppingCart.map((x) =>
            x.product === existItem.product ? item : x
          ),
        };
      } else {
        return {
          ...state,
          shoppingCart: [...state.shoppingCart, item],
        };
      }
    case CART_REMOVE_ITEM:
      return {
        ...state,
        shoppingCart: state.shoppingCart.filter(
          (x) => x.product !== action.payload
        ),
      };
    default:
      return state;
  }
};
