import React, { useEffect } from 'react';
import { addToCart } from '../actions/cartActions';
import { useDispatch } from 'react-redux';

const CartScreen = ({ match, location, history }) => {
  const productId = match.params.id;
  console.log(productId);
  const qty = location.search ? Number(location.search.split('=')[1]) : 1;
  console.log(qty);
  const dispatch = useDispatch();

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty));
    }
  }, [dispatch, productId, qty]);

  return (
    <div>
      cart {qty} {productId}
    </div>
  );
};

export default CartScreen;
