import {
  SUB_CATEGORY_CREATE_FAIL,
  SUB_CATEGORY_CREATE_REQUEST,
  SUB_CATEGORY_CREATE_RESET,
  SUB_CATEGORY_CREATE_SUCCESS,
  SUB_CATEGORY_DELETE_FAIL,
  SUB_CATEGORY_DELETE_REQUEST,
  SUB_CATEGORY_DELETE_SUCCESS,
  SUB_CATEGORY_DETAILS_FAIL,
  SUB_CATEGORY_DETAILS_REQUEST,
  SUB_CATEGORY_DETAILS_SUCCESS,
  SUB_CATEGORY_LIST_FAIL,
  SUB_CATEGORY_LIST_REQUEST,
  SUB_CATEGORY_LIST_SUCCESS,
  SUB_CATEGORY_UPDATE_FAIL,
  SUB_CATEGORY_UPDATE_REQUEST,
  SUB_CATEGORY_UPDATE_RESET,
  SUB_CATEGORY_UPDATE_SUCCESS,
} from '../constants/subCategoryConstants';

export const subCategoryListReducer = (
  state = { loading: true, subCategories: [] },
  action
) => {
  switch (action.type) {
    case SUB_CATEGORY_LIST_REQUEST:
      return {
        loading: true,
        subCategories: [],
      };
    case SUB_CATEGORY_LIST_SUCCESS:
      return {
        loading: false,
        success: true,
        subCategories: action.payload.subCategories,
        page: action.payload.page,
        pages: action.payload.pages,
      };
    case SUB_CATEGORY_LIST_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const subCategoryDetailsReducer = (
  state = { subCategory: {}, loading: true },
  action
) => {
  switch (action.type) {
    case SUB_CATEGORY_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case SUB_CATEGORY_DETAILS_SUCCESS:
      return {
        loading: false,
        subCategory: action.payload,
      };
    case SUB_CATEGORY_DETAILS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export const subCategoryDeleteReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case SUB_CATEGORY_DELETE_REQUEST:
      return {
        loading: true,
      };
    case SUB_CATEGORY_DELETE_SUCCESS:
      return {
        loading: false,
        success: true,
      };
    case SUB_CATEGORY_DELETE_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const subCategoryCreateReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case SUB_CATEGORY_CREATE_REQUEST:
      return {
        loading: true,
      };
    case SUB_CATEGORY_CREATE_SUCCESS:
      return {
        loading: false,
        success: true,
        subCategory: action.payload,
      };
    case SUB_CATEGORY_CREATE_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case SUB_CATEGORY_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const subCategoryUpdateReducer = (
  state = { loading: true, subCategory: {} },
  action
) => {
  switch (action.type) {
    case SUB_CATEGORY_UPDATE_REQUEST:
      return { loading: true };
    case SUB_CATEGORY_UPDATE_SUCCESS:
      return {
        loading: false,
        success: true,
        subCategory: action.payload,
      };
    case SUB_CATEGORY_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case SUB_CATEGORY_UPDATE_RESET:
      return { subCategory: {} };

    default:
      return state;
  }
};
