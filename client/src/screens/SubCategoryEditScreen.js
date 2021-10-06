import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';

import {
  listSubCategoryDetails,
  updateSubCategory,
} from '../actions/subCategoryActions';
import {
  SUB_CATEGORY_CREATE_RESET,
  SUB_CATEGORY_DETAILS_RESET,
  SUB_CATEGORY_UPDATE_RESET,
} from '../constants/subCategoryConstants';
import slugify from 'slugify';
import { toast } from 'react-toastify';
import { listCategories } from '../actions/categoryActions';

const SubCategoryEditScreen = ({ match, history }) => {
  const subCategoryId = match.params.id;

  const [name, setName] = useState('');

  const [slug, setSlug] = useState('');

  const dispatch = useDispatch();
  const [parent, setParent] = useState('');

  const categoryList = useSelector((state) => state.categoryList);
  const {
    loading: categoriesLoading,
    error: categoriesError,

    categories,
  } = categoryList;

  const subCategoryDetails = useSelector((state) => state.subCategoryDetails);
  const { loading, error, subCategory } = subCategoryDetails;
  console.log(subCategory);
  const subCategoryUpdate = useSelector((state) => state.subCategoryUpdate);
  const { error: errorUpdate, success: successUpdate } = subCategoryUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: SUB_CATEGORY_UPDATE_RESET });

      history.push('/admin/subcategories');
    } else {
      if (!subCategory || subCategory._id !== subCategoryId) {
        dispatch(listSubCategoryDetails(subCategoryId));
      } else {
        setName(subCategory.name);
        setParent(subCategory.parent);
        setSlug(slugify(subCategory.name).toLowerCase());
      }
    }

    dispatch(listCategories());
  }, [dispatch, history, subCategoryId, subCategory, successUpdate]);
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateSubCategory({
        _id: subCategoryId,
        name,
        parent,
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
      <Row>
        <Col>
          <Link to='/admin/subcategories' className='btn btn-light my-3'>
            Go Back
          </Link>

          <h1>EDIT SUBCATEGORY</h1>
        </Col>
      </Row>
      <Row className='pb-2'>
        <Col>
          {categoriesLoading ? (
            <Loader />
          ) : categoriesError ? (
            <Message variant='danger'>{error}</Message>
          ) : categories.length === 0 ? (
            <Message>
              There are no categories to show. Please create some.
            </Message>
          ) : (
            <>
              <Form.Label>Select Categories</Form.Label>
              <Form.Control
                as='select'
                value={parent}
                onChange={(e) => setParent(e.target.value)}
              >
                <option>Please select for new category .</option>
                {categories.length > 0 &&
                  categories.map((category) => {
                    return (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    );
                  })}
              </Form.Control>
            </>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          {/* {JSON.stringify(parent)} */}

          {/* {loadingUpdate && <Loader />} */}
          {errorUpdate && (
            <Message variant='danger'>Please select category.</Message>
          )}
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

              <Button
                type='submit'
                variant='primary'
                disabled={name && parent ? false : true}
              >
                Update
              </Button>
            </Form>
          )}
        </Col>
      </Row>
    </>
  );
};

export default SubCategoryEditScreen;
