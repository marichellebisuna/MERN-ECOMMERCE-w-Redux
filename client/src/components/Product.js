import React from 'react';
import { Card } from 'react-bootstrap';
import Rating from './Rating';
import { Link } from 'react-router-dom';

const Product = ({ product }) => {
  console.log(product);
  return (
    <Card className='my-3  rounded'>
      <Link to={`/product/${product._id}`}>
        <Card.Img variant='top' src={product.images} />
      </Link>
      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title>
            {product.name}- ${product.price}
          </Card.Title>
        </Link>
        <Card.Text as='div'>
          <div className=''>
            <Rating
              rating={product.rating}
              text={`${product.numReviews} reviews`}
            />
          </div>
        </Card.Text>
      </Card.Body>
      <Card.Footer as='div'>
        <div className='d-flex flex-col justify-content-center '>
          <div className='d-flex flex-row text-center justify-content-center pr-lg-3  division-left'>
            <Link to={`/product/${product._id}`}>
              {/* <Button variant='light'> */}
              <div>
                <i className='fas fa-eye' />
              </div>
              <div>View Product </div>
              {/* </Button> */}
            </Link>
          </div>
          {product.countInStock === 0 ? (
            <div className='d-flex flex-row text-center justify-content-center  no-pointer division-right text-center pl-lg-3'>
              {/* <Button disabled> */}
              <Link to={`/product/${product._id}`} disabled>
                <div>
                  <i className='fas fa-shopping-cart' />
                </div>
                <div className=''>Out of Stock</div>
              </Link>
              {/* </Button> */}
            </div>
          ) : (
            <div className='d-flex flex-row justify-content-center text-center division-right pl-lg-3'>
              <Link to={`/product/${product._id}`}>
                {/* <Button variant='light'> */}
                <div>
                  <i className='fas fa-shopping-cart' />
                </div>
                <div className='pl-2'>Add to Cart</div>
                {/* </Button> */}
              </Link>
            </div>
          )}
        </div>
      </Card.Footer>
    </Card>
  );
};

export default Product;
