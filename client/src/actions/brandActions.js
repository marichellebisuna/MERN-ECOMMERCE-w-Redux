import axios from 'axios';
import {
  BRAND_CREATE_FAIL,
  BRAND_CREATE_REQUEST,
  BRAND_CREATE_SUCCESS,
  BRAND_DELETE_FAIL,
  BRAND_DELETE_REQUEST,
  BRAND_DELETE_SUCCESS,
  BRAND_DETAILS_FAIL,
  BRAND_DETAILS_REQUEST,
  BRAND_DETAILS_SUCCESS,
  BRAND_LIST_FAIL,
  BRAND_LIST_REQUEST,
  BRAND_LIST_SUCCESS,
  BRAND_UPDATE_FAIL,
  BRAND_UPDATE_REQUEST,
  BRAND_UPDATE_SUCCESS,
} from '../constants/brandConstants';
import { logout } from './userActions';

export const listBrands = () => async (dispatch) => {
  dispatch({ type: BRAND_LIST_REQUEST });
  try {
    const { data } = await axios.get(`/api/brands`);

    dispatch({
      type: BRAND_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: BRAND_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listBrandDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: BRAND_DETAILS_REQUEST, payload: id });
    const { data } = await axios.get(`/api/brands/${id}`);
    // /api/brands/${slug}
    dispatch({
      type: BRAND_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: BRAND_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteBrand = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: BRAND_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    await axios.delete(`/api/brands/${id}`, config);
    // /api/brands/${slug}

    dispatch({
      type: BRAND_DELETE_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: BRAND_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const createBrand = () => async (dispatch, getState) => {
  try {
    dispatch({ type: BRAND_CREATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(`/api/brands`, {}, config);

    dispatch({
      type: BRAND_CREATE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: BRAND_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateBrand = (brand) => async (dispatch, getState) => {
  try {
    dispatch({
      type: BRAND_UPDATE_REQUEST,
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
      // `/api/brands/${BRAND.slug}`,
      `/api/brands/${brand._id}`,
      brand,
      config
    );

    dispatch({
      type: BRAND_UPDATE_SUCCESS,
      payload: data,
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
      type: BRAND_UPDATE_FAIL,
      payload: message,
    });
  }
};
