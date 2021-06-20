import {
  CART_ADD_ITEM,
  CART_EMPTY,
  CART_REMOVE_ITEM,
  CART_SAVE_PAYMENT_METHOD,
  CART_SAVE_SHIPPING_ADDRESS,
} from '../constants/cartConstants';

export const cartReducer = (
  state = { shoppingCart: [], shippingAddress: {} },
  action
) => {
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
    case CART_SAVE_SHIPPING_ADDRESS:
      return {
        ...state,
        shippingAddress: action.payload,
      };
    case CART_SAVE_PAYMENT_METHOD:
      return {
        ...state,
        paymentMethod: action.payload,
      };
    case CART_EMPTY:
      return {
        ...state,
        shoppingCart: [],
      };
    default:
      return state;
  }
};
