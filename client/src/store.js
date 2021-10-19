import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import {
  productListReducer,
  productDetailsReducer,
  productDeleteReducer,
  productCreateReducer,
  productUpdateReducer,
  productReviewCreateReducer,
  productTopRatedReducer,
  productCategoryListReducer,
} from './reducers/productReducers';
import { cartReducer } from './reducers/cartReducer';
import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
  userListReducer,
  userDeleteReducer,
  userUpdateReducer,
  userAddressMapReducer,
  userActivateReducer,
} from './reducers/userReducers';
import {
  orderCreateReducer,
  orderDetailsReducer,
  orderPayReducer,
  orderListMyReducer,
  orderListReducer,
  orderDeliverReducer,
  orderSummaryReducer,
} from './reducers/orderReducers';
import {
  categoryCreateReducer,
  categoryDeleteReducer,
  categoryDetailsReducer,
  categoryListReducer,
  categoryUpdateReducer,
} from './reducers/categoryReducers';
import {
  subCategoryCreateReducer,
  subCategoryDeleteReducer,
  subCategoryDetailsReducer,
  subCategoryListReducer,
  subCategoryUpdateReducer,
} from './reducers/subCategoryReducers';
import {
  brandCreateReducer,
  brandDeleteReducer,
  brandDetailsReducer,
  brandListReducer,
  brandUpdateReducer,
} from './reducers/brandReducers';
import {
  couponCreateReducer,
  couponDeleteReducer,
  couponDetailsReducer,
  couponListReducer,
  couponUpdateReducer,
  couponCountReducer,
  couponsBySearchReducer,
} from './reducers/couponReducers';

const reducer = combineReducers({
  productList: productListReducer,
  productCategoryList: productCategoryListReducer,
  productDetails: productDetailsReducer,
  productDelete: productDeleteReducer,
  productCreate: productCreateReducer,
  productUpdate: productUpdateReducer,
  productReviewCreate: productReviewCreateReducer,
  productTopRated: productTopRatedReducer,
  categoryList: categoryListReducer,
  categoryDetails: categoryDetailsReducer,
  categoryDelete: categoryDeleteReducer,
  categoryCreate: categoryCreateReducer,
  categoryUpdate: categoryUpdateReducer,
  subCategoryList: subCategoryListReducer,
  subCategoryDetails: subCategoryDetailsReducer,
  subCategoryDelete: subCategoryDeleteReducer,
  subCategoryCreate: subCategoryCreateReducer,
  subCategoryUpdate: subCategoryUpdateReducer,
  brandList: brandListReducer,
  brandDetails: brandDetailsReducer,
  brandDelete: brandDeleteReducer,
  brandCreate: brandCreateReducer,
  brandUpdate: brandUpdateReducer,
  couponList: couponListReducer,
  couponDetails: couponDetailsReducer,
  couponDelete: couponDeleteReducer,
  couponCreate: couponCreateReducer,
  couponUpdate: couponUpdateReducer,
  couponCount: couponCountReducer,
  couponsBySearch: couponsBySearchReducer,
  cart: cartReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdate: userUpdateReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  userActivate: userActivateReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
  orderDeliver: orderDeliverReducer,
  orderListMy: orderListMyReducer,
  orderList: orderListReducer,
  userAddressMap: userAddressMapReducer,
  orderSummary: orderSummaryReducer,
});

const cartItemsFromStorage = localStorage.getItem('shoppingCart')
  ? JSON.parse(localStorage.getItem('shoppingCart'))
  : [];
const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
  ? JSON.parse(localStorage.getItem('shippingAddress'))
  : {};
const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;
const initialState = {
  cart: {
    shoppingCart: cartItemsFromStorage,
    shippingAddress: shippingAddressFromStorage,
    paymentMethod: 'Paypal',
  },
  userLogin: { userInfo: userInfoFromStorage },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
