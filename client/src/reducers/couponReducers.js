import {
  COUPON_CREATE_FAIL,
  COUPON_CREATE_REQUEST,
  COUPON_CREATE_RESET,
  COUPON_CREATE_SUCCESS,
  COUPON_DELETE_FAIL,
  COUPON_DELETE_REQUEST,
  COUPON_DELETE_SUCCESS,
  COUPON_DETAILS_FAIL,
  COUPON_DETAILS_REQUEST,
  COUPON_DETAILS_RESET,
  COUPON_DETAILS_SUCCESS,
  COUPON_LIST_FAIL,
  COUPON_LIST_REQUEST,
  COUPON_LIST_RESET,
  COUPON_LIST_SUCCESS,
  COUPON_UPDATE_FAIL,
  COUPON_UPDATE_REQUEST,
  COUPON_UPDATE_RESET,
  COUPON_UPDATE_SUCCESS,
} from '../constants/couponConstants';

export const couponListReducer = (
  state = { loading: true, coupons: [] },
  action
) => {
  switch (action.type) {
    case COUPON_LIST_REQUEST:
      return {
        loading: true,
        coupons: [],
      };
    case COUPON_LIST_SUCCESS:
      return {
        loading: false,
        success: true,
        coupons: action.payload,
      };
    case COUPON_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case COUPON_LIST_RESET:
      return {};
    default:
      return state;
  }
};

export const couponDetailsReducer = (
  state = { coupon: {}, loading: true },
  action
) => {
  switch (action.type) {
    case COUPON_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case COUPON_DETAILS_SUCCESS:
      return {
        loading: false,
        success: true,
        coupon: action.payload,
      };
    case COUPON_DETAILS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case COUPON_DETAILS_RESET:
      return {
        coupon: {},
      };
    default:
      return state;
  }
};

export const couponDeleteReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case COUPON_DELETE_REQUEST:
      return {
        loading: true,
      };
    case COUPON_DELETE_SUCCESS:
      return {
        loading: false,
        success: true,
      };
    case COUPON_DELETE_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const couponCreateReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case COUPON_CREATE_REQUEST:
      return {
        loading: true,
      };
    case COUPON_CREATE_SUCCESS:
      return {
        loading: false,
        success: true,
        coupon: action.payload,
      };
    case COUPON_CREATE_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case COUPON_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const couponUpdateReducer = (
  state = { loading: true, coupon: {} },
  action
) => {
  switch (action.type) {
    case COUPON_UPDATE_REQUEST:
      return { loading: true };
    case COUPON_UPDATE_SUCCESS:
      return { loading: false, success: true, coupon: action.payload };
    case COUPON_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case COUPON_UPDATE_RESET:
      return { coupon: {} };
    default:
      return state;
  }
};
