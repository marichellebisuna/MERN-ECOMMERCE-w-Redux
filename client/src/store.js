import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import {
  productListReducer,
  productDetailsReducer,
} from './reducers/productReducers';
import { cartReducer } from './reducers/cartReducer';
import { userLoginReducer, userRegisterReducer } from './reducers/userReducer';

const reducer = combineReducers({
  productList: productListReducer,
  productDetails: productDetailsReducer,
  cart: cartReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
});

const cartItemsFromStorage = localStorage.getItem('shoppingCart')
  ? JSON.parse(localStorage.getItem('shoppingCart'))
  : [];
const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;
const initialState = {
  cart: {
    shoppingCart: cartItemsFromStorage,
    userLogin: userInfoFromStorage,
  },
};
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;
