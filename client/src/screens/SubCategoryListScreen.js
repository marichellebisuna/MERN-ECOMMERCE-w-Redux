import React, { useState, useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import LocalSearch from '../components/forms/localSearch';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import {
  listSubCategories,
  deleteSubCategory,
  createSubCategory,
} from '../actions/subCategoryActions';
import { SUB_CATEGORY_CREATE_RESET } from '../constants/subCategoryConstants';
import { listCategories } from '../actions/categoryActions';

const SubCategoryListScreen = ({ history, match }) => {
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [keyword, setKeyword] = useState('');
  const [parent, setParent] = useState('');

  const subCategoryDetails = useSelector((state) => state.subCategoryDetails);
  const { subCategory } = subCategoryDetails;
  console.log(subCategory);

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

  const categoryList = useSelector((state) => state.categoryList);
  const { categories } = categoryList;
  console.log(categories);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch({ type: SUB_CATEGORY_CREATE_RESET });
    if (!userInfo.isAdmin) {
      history.push('/login');
    }
    if (successSubCreate) {
      history.push('/admin/subcategories');
    }
    dispatch(listSubCategories());
    dispatch(listCategories());
  }, [
    dispatch,
    history,
    userInfo,
    successSubCreate,
    successDelete,
    createdSubCategory,
    subCategory,
  ]);

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteSubCategory(id));
      toast.success('Subcategory is deleted successfully.');
    }
  };
  const createSubCategoryHandler = (e) => {
    e.preventDefault();
    // dispatch(createSubCategory());
    try {
      dispatch(createSubCategory(name, parent));
      toast.success(`${name} is created.`);
      setName('');
    } catch (err) {
      toast.error(err.message);
    }
  };
  const searched = (keyword) => (categories) =>
    categories.name.toLowerCase().includes(keyword);
  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>SubCategories</h1>
        </Col>
      </Row>

      {loadingCreate && <Loader />}
      {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
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
                <th>PARENT CATEGORY</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {subCategories.filter(searched(keyword)).map((subCategory) => {
                return (
                  <tr key={subCategory._id}>
                    <td>{subCategory.name}</td>
                    <td>{subCategory.parent.name}</td>
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
          {subCategories.length === 0 && (
            <Message>
              There are no subcategories to show. Please create some.
            </Message>
          )}
          <Form.Label>Select Categories</Form.Label>
          <Form.Control
            as='select'
            value={parent}
            onChange={(e) => setParent(e.target.value)}
          >
            <option>Please select category .</option>
            {categories.length > 0 &&
              categories.map((category) => {
                return (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                );
              })}
          </Form.Control>
          <Form onSubmit={createSubCategoryHandler}>
            <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                required
              ></Form.Control>
            </Form.Group>

            <Button
              type='submit'
              variant='primary'
              disabled={name && parent ? false : true}
            >
              Add SubCategory
            </Button>
          </Form>
        </>
      )}
    </>
  );
};

export default SubCategoryListScreen;
