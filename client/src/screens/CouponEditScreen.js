import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { listCouponDetails, updateCoupon } from '../actions/couponActions';
import {
  COUPON_DETAILS_RESET,
  COUPON_UPDATE_RESET,
} from '../constants/couponConstants';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import DayPicker from 'react-day-picker';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import 'react-datepicker/dist/react-datepicker.css';

const CouponEditScreen = ({ match, history }) => {
  const couponId = match.params.id;
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [expiry, setExpiry] = useState(new Date());
  const [discount, setDiscount] = useState('');

  const couponDetails = useSelector((state) => state.couponDetails);
  const { loading, error, coupon, success } = couponDetails;
  console.log(coupon);
  const couponUpdate = useSelector((state) => state.couponUpdate);
  const { error: errorUpdate, success: successUpdate } = couponUpdate;

  useEffect(() => {
    dispatch({ type: COUPON_UPDATE_RESET });
    if (successUpdate && success) {
      dispatch({ type: COUPON_UPDATE_RESET });
      history.push('/admin/coupons');
    } else {
      if (!coupon || coupon._id !== couponId) {
        dispatch(listCouponDetails(couponId));
      } else {
        setName(coupon.name);
        setDiscount(coupon.discount);
        setExpiry(coupon.expiry);
      }
    }
  }, [dispatch, history, couponId, coupon, successUpdate]);
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateCoupon({
        _id: couponId,
        name,
        discount,
        expiry,
      })
    )
      .then(toast.success(`${name} is created.`))
      .catch((err) => {
        toast.error(err.message);
      });
  };
  const handleDayClick = (expiry, { selected, disabled }) => {
    if (disabled) {
      // Day is disabled, do nothing
      return;
    }
    if (selected) {
      // Unselect the day if already selected
      setExpiry(undefined);
      return;
    }
    setExpiry(expiry);
  };
  return (
    <>
      <Link to='/admin/coupons' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Coupon</h1>

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
            <Form.Group controlId='name'>
              <Form.Label>Discount %</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter discount'
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>
            {/* <Form.Group controlId='name'>
              <Form.Label className='pr-2'>Expiry Date</Form.Label>            
              <DayPicker
                onDayClick={handleDayClick}
                selectedDays={expiry}
                value={expiry}
              />             
            </Form.Group> */}
            <Form.Group controlId='name'>
              <Form.Label className='pr-5 '>Expiry Date</Form.Label>
              <DayPickerInput onDayChange={handleDayClick} value={expiry} />
            </Form.Group>
            <Button
              type='submit'
              variant='primary'
              disabled={name && discount && expiry ? false : true}
            >
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default CouponEditScreen;
