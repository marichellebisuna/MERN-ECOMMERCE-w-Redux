import axios from 'axios';
import {
  COUPON_CREATE_FAIL,
  COUPON_CREATE_REQUEST,
  COUPON_CREATE_SUCCESS,
  COUPON_DELETE_FAIL,
  COUPON_DELETE_REQUEST,
  COUPON_DELETE_SUCCESS,
  COUPON_DETAILS_FAIL,
  COUPON_DETAILS_REQUEST,
  COUPON_DETAILS_SUCCESS,
  COUPON_LIST_FAIL,
  COUPON_LIST_REQUEST,
  COUPON_LIST_SUCCESS,
  COUPON_COUNT_FAIL,
  COUPON_COUNT_REQUEST,
  COUPON_COUNT_SUCCESS,
  COUPON_UPDATE_FAIL,
  COUPON_UPDATE_REQUEST,
  COUPON_UPDATE_RESET,
  COUPON_UPDATE_SUCCESS,
} from '../constants/couponConstants';
import { logout } from './userActions';

export const listCoupons =
  (keyword = '', pageNumber = '') =>
  async (dispatch) => {
    dispatch({ type: COUPON_LIST_REQUEST });
    try {
      const { data } = await axios.get(
        `/api/coupons?keyword=${keyword}&pageNumber=${pageNumber}`
      );

      dispatch({
        type: COUPON_LIST_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: COUPON_LIST_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const listCouponsBySearch = (page) => async (dispatch, getState) => {
  try {
    dispatch({ type: COUPON_LIST_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.post(`/api/coupons`, { page }, config);

    dispatch({
      type: COUPON_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: COUPON_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getCouponsCount = () => async (dispatch, getState) => {
  try {
    dispatch({ type: COUPON_COUNT_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.get(`/api/coupons/total`, config);

    dispatch({
      type: COUPON_COUNT_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: COUPON_COUNT_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
export const listCouponDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: COUPON_DETAILS_REQUEST, payload: id });
    const { data } = await axios.get(`/api/coupons/${id}`);
    // /api/coupons/${slug}
    dispatch({
      type: COUPON_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: COUPON_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteCoupon = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: COUPON_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    await axios.delete(`/api/coupons/${id}`, config);
    // /api/coupons/${slug}

    dispatch({
      type: COUPON_DELETE_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: COUPON_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const createCoupon =
  (name, discount, expiry) => async (dispatch, getState) => {
    try {
      dispatch({ type: COUPON_CREATE_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(
        `/api/coupons`,
        { name, discount, expiry },
        config
      );

      dispatch({
        type: COUPON_CREATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: COUPON_CREATE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const updateCoupon = (coupon) => async (dispatch, getState) => {
  try {
    dispatch({
      type: COUPON_UPDATE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put(
      // `/api/coupons/${coupon.slug}`,
      `/api/coupons/${coupon._id}`,
      coupon,
      config
    );

    dispatch({
      type: COUPON_UPDATE_SUCCESS,
      payload: data,
    });
    dispatch({
      type: COUPON_UPDATE_RESET,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
    if (message === 'Not authorized, token failed') {
      dispatch(logout());
    }
    dispatch({
      type: COUPON_UPDATE_FAIL,
      payload: message,
    });
  }
};
