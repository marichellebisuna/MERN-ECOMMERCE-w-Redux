import React, { useState, useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import LocalSearch from '../components/forms/localSearch';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import {
  listCategories,
  deleteCategory,
  createCategory,
} from '../actions/categoryActions';
import { CATEGORY_CREATE_RESET } from '../constants/categoryConstants';

const CategoryListScreen = ({ history, match }) => {
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [keyword, setKeyword] = useState('');

  const categoryList = useSelector((state) => state.categoryList);
  const { loading, error, categories } = categoryList;

  const categoryDelete = useSelector((state) => state.categoryDelete);
  const { success: successDelete } = categoryDelete;

  const categoryCreate = useSelector((state) => state.categoryCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    category: createdCategory,
  } = categoryCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch({ type: CATEGORY_CREATE_RESET });
    if (!userInfo.isAdmin) {
      history.push('/login');
    }
    if (successCreate) {
      history.push('/admin/categories/');
    }
    dispatch(listCategories());
  }, [
    dispatch,
    history,
    userInfo,
    successCreate,
    successDelete,
    createdCategory,
  ]);

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteCategory(id));
    }
  };
  const createCategoryHandler = (e) => {
    e.preventDefault();
    try {
      dispatch(createCategory(name));
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
          <h1>Categories</h1>
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
          <Table striped bordered hover responsive className='table-sm mt-4'>
            <thead>
              <tr>
                <th>ID </th>
                <th>NAME </th>
                <th>SLUG</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {categories.filter(searched(keyword)).map((category) => {
                return (
                  <tr key={category._id}>
                    <td>{category._id}</td>
                    <td>{category.name}</td>
                    <td>{category.slug}</td>
                    <td>
                      <LinkContainer
                        to={`/admin/categories/${category._id}/edit`}
                      >
                        <Button variant='light' className='btn-sm'>
                          <i className='fas fa-edit'></i>
                        </Button>
                      </LinkContainer>
                      <Button
                        variant='danger'
                        className='btn-sm'
                        onClick={() => deleteHandler(category._id)}
                      >
                        <i className='fas fa-trash'></i>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          {categories.length === 0 && (
            <Message>
              There is no categories to show. Please create some.
            </Message>
          )}
          <Form onSubmit={createCategoryHandler}>
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

            <Button type='submit' variant='primary'>
              Add Category
            </Button>
          </Form>
        </>
      )}
    </>
  );
};

export default CategoryListScreen;
