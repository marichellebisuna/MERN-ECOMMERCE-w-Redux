import React, { useEffect, useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import LocalSearch from '../components/forms/localSearch';
import { toast } from 'react-toastify';
import {
  listSubCategories,
  deleteSubCategory,
  createSubCategory,
} from '../actions/subCategoryActions';

import {
  SUB_CATEGORY_CREATE_RESET,
  SUB_CATEGORY_LIST_RESET,
  SUB_CATEGORY_UPDATE_RESET,
} from '../constants/subCategoryConstants';

const SubCategoryListScreen = ({ history, match }) => {
  const dispatch = useDispatch();

  const [keyword, setKeyword] = useState('');
  const [parent, setParent] = useState('');
  const subCategoryList = useSelector((state) => state.subCategoryList);
  const { loading, error, subCategories } = subCategoryList;
  console.log(subCategories);
  const subCategoryDelete = useSelector((state) => state.subCategoryDelete);
  const { success: successDelete } = subCategoryDelete;

  const subCategoryCreate = useSelector((state) => state.subCategoryCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successSubCreate,
    subCategory: createdSubCategory,
  } = subCategoryCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch({ type: SUB_CATEGORY_CREATE_RESET });

    if (!userInfo.isAdmin) {
      history.push('/login');
    }
    if (successSubCreate) {
      history.push(`/admin/subcategories/${createdSubCategory._id}/edit`);
    }

    dispatch(listSubCategories());
  }, [
    dispatch,
    history,
    userInfo,
    successSubCreate,
    successDelete,
    createdSubCategory,
  ]);

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteSubCategory(id));
      toast.success('Subcategory is deleted successfully.');
    }
  };
  const createSubCategoryHandler = () => {
    dispatch(createSubCategory());
  };
  const searched = (keyword) => (categories) =>
    categories.name.toLowerCase().includes(keyword);
  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>SubCategories</h1>
        </Col>
        <Col className='text-right'>
          <Button className='my-3' onClick={createSubCategoryHandler}>
            <i className='fas fa-plus'></i> Create SubCategory
          </Button>
        </Col>
      </Row>

      {loadingCreate && <Loader />}
      {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : subCategories.length === 0 ? (
        <Message>
          There are no subcategories to show. Please create some.
        </Message>
      ) : (
        <>
          <LocalSearch keyword={keyword} setKeyword={setKeyword} />
          <Table
            striped
            bordered
            hover
            responsive
            className='table-sm table table-striped'
          >
            <thead>
              <tr>
                <th>NAME </th>
                {/* <th>PARENT</th> */}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {subCategories.filter(searched(keyword)).map((subCategory) => {
                return (
                  <tr key={subCategory._id}>
                    <td>{subCategory.name}</td>
                    {/* <td>{subCategory.parent.name}</td> */}
                    <td className='text-right'>
                      <LinkContainer
                        to={`/admin/subcategories/${subCategory._id}/edit`}
                      >
                        <Button variant='light' className='btn-sm'>
                          <i className='fas fa-edit'></i>
                        </Button>
                      </LinkContainer>
                      <Button
                        variant='danger'
                        className='btn-sm'
                        onClick={() => deleteHandler(subCategory._id)}
                      >
                        <i className='fas fa-trash'></i>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export default SubCategoryListScreen;
