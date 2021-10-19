import React, { useState, useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import Searchbox from '../components/coupons/Searchbox';
import Paginate from '../components/coupons/Paginate';
import { Route } from 'react-router-dom';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import {
  listCoupons,
  deleteCoupon,
  createCoupon,
} from '../actions/couponActions';
import { COUPON_CREATE_RESET } from '../constants/couponConstants';

const CouponListScreen = ({ history, match }) => {
  const keyword = match.params.keyword;
  const pageNumber = match.params.pageNumber || 1;
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [expiry, setExpiry] = useState(new Date());
  const [discount, setDiscount] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  const couponList = useSelector((state) => state.couponList);
  const { loading, error, coupons, pages, page } = couponList;

  const couponDelete = useSelector((state) => state.couponDelete);
  const { success: successDelete } = couponDelete;

  const couponCreate = useSelector((state) => state.couponCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    coupon: createdCoupon,
  } = couponCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch({ type: COUPON_CREATE_RESET });
    if (!userInfo.isAdmin) {
      history.push('/login');
    }
    if (successCreate) {
      history.push('/admin/coupons');
    }
    dispatch(listCoupons(keyword, pageNumber));
  }, [
    dispatch,
    history,
    userInfo,
    successCreate,
    successDelete,
    createdCoupon,
    keyword,
    pageNumber,
  ]);

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteCoupon(id));
      toast.success('Coupon is deleted successfully.');
    }
  };
  const createCouponHandler = (e) => {
    e.preventDefault();
    try {
      dispatch(createCoupon(name, discount, expiry));
      toast.success(`${name} is created.`);
      setName('');
      setDiscount('');
      setExpiry('');
    } catch (err) {
      toast.error(err.message);
    }
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
  const handleOnChange = (e) => {
    e.preventDefault();
    setIsChecked(!isChecked);
  };

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Coupons</h1>
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
                <th>
                  <input type='checkbox' />
                </th>
                <th>NAME </th>
                <th>DISCOUNT </th>
                <th>Expiry</th>
                <th>Slug</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {coupons.map((coupon) => {
                return (
                  <tr key={coupon._id}>
                    <td>
                      {' '}
                      <Form.Group
                        className='mb-3'
                        controlId='formBasicCheckbox'
                      >
                        <Form.Check
                          type='checkbox'
                          value={coupon._id}
                          checked={isChecked}
                          onChange={(e) => setIsChecked(e.target.checked)}
                        />
                      </Form.Group>
                    </td>
                    <td>{coupon.name}</td>
                    <td>{coupon.discount}</td>
                    <td>{coupon.expiry}</td>
                    <td>{coupon.slug}</td>
                    <td>
                      <LinkContainer to={`/admin/coupons/${coupon._id}/edit`}>
                        <Button variant='light' className='btn-sm'>
                          <i className='fas fa-edit'></i>
                        </Button>
                      </LinkContainer>
                      <Button
                        variant='danger'
                        className='btn-sm'
                        onClick={() => deleteHandler(coupon._id)}
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
          {coupons.length === 0 && (
            <Message>There is no coupons to show. </Message>
          )}
          <Form onSubmit={createCouponHandler}>
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
                type='number'
                max='99'
                placeholder='Enter discount'
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='name'>
              <Form.Label className='pr-5 '>Expiry Date</Form.Label>
              <DayPickerInput onDayChange={handleDayClick} value={expiry} />
            </Form.Group>
            <Button
              type='submit'
              variant='primary'
              disabled={name && discount && expiry ? false : true}
            >
              Create Coupon
            </Button>
          </Form>
        </>
      )}
    </>
  );
};

export default CouponListScreen;
