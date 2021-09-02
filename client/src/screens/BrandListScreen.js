import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';

import { listBrands, deleteBrand, createBrand } from '../actions/brandActions';

import { BRAND_CREATE_RESET } from '../constants/brandConstants';

const BrandListScreen = ({ history, match }) => {
  const dispatch = useDispatch();

  const brandList = useSelector((state) => state.brandList);
  const { loading, error, brands } = brandList;

  const brandDelete = useSelector((state) => state.brandDelete);
  const { loading: loadingDelete, success: successDelete } = brandDelete;

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
      history.push(`/admin/brand/${createdBrand._id}/edit`);
    }
    dispatch(listBrands());
  }, [dispatch, history, userInfo, successCreate, successDelete, createdBrand]);

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteBrand(id));
    }
  };
  const createBrandHandler = (brand) => {
    dispatch(createBrand());
  };
  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>brands</h1>
        </Col>
        <Col className='text-right'>
          <Button className='my-3' onClick={createBrandHandler}>
            <i className='fas fa-plus'></i> Create Brand
          </Button>
        </Col>
      </Row>

      {loadingCreate && <Loader />}
      {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : brands.length === 0 ? (
        <Message>There is no brands to show. Please create some.</Message>
      ) : (
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
                    <LinkContainer to={`/admin/brand/${brand._id}/edit`}>
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
      )}
    </>
  );
};

export default BrandListScreen;
