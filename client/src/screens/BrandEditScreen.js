import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { listBrandDetails, updateBrand } from '../actions/brandActions';
import { BRAND_UPDATE_RESET } from '../constants/brandConstants';
import slugify from 'slugify';
import { toast } from 'react-toastify';

const BrandEditScreen = ({ match, history }) => {
  const brandId = match.params.id;

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  const dispatch = useDispatch();

  const brandDetails = useSelector((state) => state.brandDetails);
  const { loading, error, brand } = brandDetails;

  const brandUpdate = useSelector((state) => state.brandUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = brandUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: BRAND_UPDATE_RESET });
      history.push('/admin/brands');
    } else {
      if (!brand || brand._id !== brandId) {
        dispatch(listBrandDetails(brandId));
      } else {
        setName(brand.name);
        setSlug(slugify(brand.name).toLowerCase());
      }
    }
  }, [dispatch, history, brandId, brand, successUpdate]);
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateBrand({
        _id: brandId,
        name,
        slug: slugify(name),
      })
    )
      .then(toast.success(`${name} is created.`))
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <>
      <Link to='/admin/brands' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Brand</h1>
        {/* {loadingUpdate && <Loader />} */}
        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
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
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default BrandEditScreen;
