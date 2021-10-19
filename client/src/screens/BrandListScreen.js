import React, { useState, useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Paginate from '../components/brands/Paginate';
import Searchbox from '../components/brands/Searchbox';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { listBrands, deleteBrand, createBrand } from '../actions/brandActions';
import { BRAND_CREATE_RESET } from '../constants/brandConstants';
import { Route } from 'react-router-dom';

const BrandListScreen = ({ history, match }) => {
  const keyword = match.params.keyword;
  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useDispatch();

  const [name, setName] = useState('');

  const brandList = useSelector((state) => state.brandList);
  const { loading, error, brands, pages, page } = brandList;

  const brandDelete = useSelector((state) => state.brandDelete);
  const { success: successDelete } = brandDelete;

  const brandCreate = useSelector((state) => state.brandCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    brand: createdBrand,
  } = brandCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch({ type: BRAND_CREATE_RESET });
    if (!userInfo.isAdmin) {
      history.push('/login');
    }
    if (successCreate) {
      history.push('/admin/brands');
    }
    dispatch(listBrands(keyword, pageNumber));
  }, [
    dispatch,
    history,
    userInfo,
    successCreate,
    successDelete,
    createdBrand,
    keyword,
    pageNumber,
  ]);

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteBrand(id));
    }
  };
  const createBrandHandler = (e) => {
    e.preventDefault();
    try {
      dispatch(createBrand(name));
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
          <h1>Brands</h1>
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
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID </th>
                <th>NAME </th>
                <th>SLUG</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand) => {
                return (
                  <tr key={brand._id}>
                    <td>{brand._id}</td>
                    <td>{brand.name}</td>
                    <td>{brand.slug}</td>
                    <td>
                      <LinkContainer to={`/admin/brands/${brand._id}/edit`}>
                        <Button variant='light' className='btn-sm'>
                          <i className='fas fa-edit'></i>
                        </Button>
                      </LinkContainer>
                      <Button
                        variant='danger'
                        className='btn-sm'
                        onClick={() => deleteHandler(brand._id)}
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
          {brands.length === 0 && (
            <Message>There are no brands to show.</Message>
          )}
          <Form onSubmit={createBrandHandler}>
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
              Add Brand
            </Button>
          </Form>
        </>
      )}
    </>
  );
};

export default BrandListScreen;
