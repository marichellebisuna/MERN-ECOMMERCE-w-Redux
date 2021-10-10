import React, { useState, useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import LocalSearch from '../components/forms/localSearch';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { listBrands, deleteBrand, createBrand } from '../actions/brandActions';
import { BRAND_CREATE_RESET } from '../constants/brandConstants';

const BrandListScreen = ({ history, match }) => {
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [keyword, setKeyword] = useState('');

  const brandList = useSelector((state) => state.brandList);
  const { loading, error, brands } = brandList;

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
    dispatch(listBrands());
  }, [dispatch, history, userInfo, successCreate, successDelete, createdBrand]);

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
  const searched = (keyword) => (brands) =>
    brands.name.toLowerCase().includes(keyword);
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
          <LocalSearch keyword={keyword} setKeyword={setKeyword} />
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
              {brands.filter(searched(keyword)).map((brand) => {
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
          {brands.length === 0 && (
            <Message>There are no brands to show. Please create some.</Message>
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
