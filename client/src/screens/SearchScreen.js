import React, { useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../actions/productActions';
import Product from '../components/Product';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { Link, useParams } from 'react-router-dom';

const SearchScreen = (props) => {
  const { name = 'all', category = 'all' } = useParams();

  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  const productCategoryList = useSelector((state) => state.productCategoryList);
  const {
    loading: loadingCategories,
    error: errorCategories,
    success,
    categories,
  } = productCategoryList;

  useEffect(() => {
    dispatch(
      listProducts({
        name: name !== 'all' ? name : '',
        category: category !== 'all' ? category : '',
      })
    );
  }, [dispatch, name, category]);

  const getFilterUrl = (filter) => {
    const filterCategory = filter.category || category;
    const filterName = filter.name || name;
    return `/search/category/${filterCategory}/name/${filterName}`;
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
            <h5>{`${products.length} Results`}</h5>
            <p>
              <h4>Department</h4>
            </p>
            <div>
              {categories.map((c) => (
                <div key={c}>
                  <Link
                    className={c === category ? 'active' : ''}
                    to={getFilterUrl({ category: c })}
                  >
                    {c}
                  </Link>
                </div>
              ))}
            </div>
          </Col>
        )}

        <Col md={9}>
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant='danger'>{error}</Message>
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
