import React, { useState, useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Searchbox from '../components/categories/Searchbox';
import Paginate from '../components/categories/Paginate';
import { Route } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  listCategories,
  deleteCategory,
  createCategory,
} from '../actions/categoryActions';
import { CATEGORY_CREATE_RESET } from '../constants/categoryConstants';

const CategoryListScreen = ({ history, match }) => {
  const keyword = match.params.keyword;
  const pageNumber = match.params.pageNumber || 1;
  const dispatch = useDispatch();

  const [name, setName] = useState('');

  const categoryList = useSelector((state) => state.categoryList);
  const { loading, error, categories, pages, page } = categoryList;

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
    dispatch(listCategories(keyword, pageNumber));
  }, [
    dispatch,
    history,
    userInfo,
    successCreate,
    successDelete,
    createdCategory,
    keyword,
    pageNumber,
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
          <Route render={({ history }) => <Searchbox history={history} />} />
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
              {categories.map((category) => {
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
          <Paginate pages={pages} page={page} keyword={keyword && keyword} />
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
