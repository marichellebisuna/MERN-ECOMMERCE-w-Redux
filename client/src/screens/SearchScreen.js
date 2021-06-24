import React, { useEffect } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../actions/productActions';
import Product from '../components/Product';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { Link, useParams } from 'react-router-dom';
import { prices, ratings } from '../utils';
import Rating from '../components/Rating';

const SearchScreen = (props) => {
  const {
    name = 'all',
    category = 'all',
    min = 0,
    max = 0,
    rating = 0,
    order = 'newest',
  } = useParams();

  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;
  console.log(products);
  const productCategoryList = useSelector((state) => state.productCategoryList);
  const {
    loading: loadingCategories,
    error: errorCategories,

    categories,
  } = productCategoryList;

  useEffect(() => {
    dispatch(
      listProducts({
        name: name !== 'all' ? name : '',
        category: category !== 'all' ? category : '',
        min,
        max,
        rating,
        order,
      })
    );
  }, [dispatch, name, category, min, max, rating, order]);

  const getFilterUrl = (filter) => {
    const filterCategory = filter.category || category;
    const filterName = filter.name || name;
    const filterMin = filter.min ? filter.min : filter.min === 0 ? 0 : min;
    const filterMax = filter.max ? filter.max : filter.max === 0 ? 0 : max;
    const filterRating = filter.rating || rating;
    const sortOrder = filter.order || order;
    return `/search/category/${filterCategory}/name/${filterName}/min/${filterMin}/max/${filterMax}/rating/${filterRating}/order/${sortOrder}`;
  };

  return (
    <>
      <Row>
        {loadingCategories ? (
          <Loader />
        ) : errorCategories ? (
          <Message variant='danger'>{errorCategories}</Message>
        ) : (
          <Col md={3}>
            <h5 className='active'>{`${products.length} Results`}</h5>

            <div>
              <p className='pt-2 mb-0'>
                <h4>Department</h4>
              </p>
              <div>
                <div>
                  <Link
                    className={'all' === category ? 'active' : ''}
                    to={getFilterUrl({ category: 'all' })}
                  >
                    Any
                  </Link>
                </div>
                {categories.map((c) => (
                  <div key={c.name}>
                    <Link
                      className={c === category ? 'active' : ''}
                      to={getFilterUrl({ category: c })}
                    >
                      {c}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className='pt-2 mb-0'>
                <h4>Prices</h4>
              </p>
              <div>
                {prices.map((p) => (
                  <div key={p.name}>
                    <Link
                      to={getFilterUrl({ min: p.min, max: p.max })}
                      className={
                        `${p.min}-${p.max}` === `${min}-${max}` ? 'active' : ''
                      }
                    >
                      {p.name}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className='pt-2 mb-0'>
                <h4>Average Customer Review</h4>
              </p>
              <div>
                {ratings.map((r) => (
                  <div key={r.name}>
                    <Link
                      to={getFilterUrl({ rating: r.rating })}
                      className={`${r.rating}` === `${rating}` ? 'active' : ''}
                    >
                      <Rating caption={' & up'} rating={r.rating}></Rating>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </Col>
        )}

        <Col md={9}>
          <Row>
            <Col></Col>
            <Col md={4}>
              {' '}
              <Form.Control
                as='select'
                value={order}
                onChange={(e) => {
                  props.history.push(getFilterUrl({ order: e.target.value }));
                }}
              >
                <option value='newest'>Newest Arrival</option>
                <option value='lowest'>Price: Low to High</option>
                <option value='highest'>Price: High to Low</option>
                <option value='toprated'>Avg. Customer Reviews</option>
              </Form.Control>
            </Col>
          </Row>

          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant='danger'>{error}</Message>
          ) : products.length === 0 ? (
            <h4>No product found.</h4>
          ) : (
            <Row xl={3} lg={3} md={3} sm={2} xs={1}>
              {products.map((product) => (
                <Col key={product._id}>
                  <Product product={product} />
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </>
  );
};

export default SearchScreen;
