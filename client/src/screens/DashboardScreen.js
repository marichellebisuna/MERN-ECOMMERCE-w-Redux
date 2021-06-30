import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { Row, Col, Container } from 'react-bootstrap';
import { summaryOrder } from '../actions/orderActions';
import Chart from 'react-google-charts';

const DashboardScreen = ({ history }) => {
  const orderSummary = useSelector((state) => state.orderSummary);
  const { loading, summary, error } = orderSummary;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userInfo.isAdmin) {
      history.push('/login');
    } else {
      dispatch(summaryOrder());
    }
  }, [dispatch, history, userInfo]);

  return (
    <div>
      <Row>
        <h1>Dashboard</h1>
      </Row>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Row>
            <Col className='summary '>
              <Row className='summary-title color1 '>
                <Col>
                  <span>
                    <i className='fa fa-users' />
                    Users
                  </span>
                </Col>
              </Row>
              <Row className='summary-body'>
                <Col>{summary.users[0].numUsers}</Col>
              </Row>
            </Col>
            <Col className='summary'>
              <Row className='summary-title color2'>
                <Col>
                  <span>
                    <i className='fa fa-shopping-cart' />
                    Orders
                  </span>
                </Col>
              </Row>
              <Row className='summary-body'>
                <Col>{summary.orders[0] ? summary.orders[0].numOrders : 0}</Col>
              </Row>
            </Col>
            <Col className='summary'>
              <Row className='summary-title color3'>
                <Col>
                  <span>
                    <i class='far fa-money-bill-alt' />
                    Sales
                  </span>
                </Col>
              </Row>
              <Row className='summary-body'>
                <Col>
                  $
                  {summary.orders[0]
                    ? summary.orders[0].totalSales.toFixed(2)
                    : 0}
                </Col>
              </Row>
            </Col>
          </Row>

          <Row>
            <h1>Sales</h1>

            <Col>
              {summary.dailyOrders.length === 0 ? (
                <Message>No Sale</Message>
              ) : (
                <Chart
                  width='1200px'
                  height='400px'
                  chartType='AreaChart'
                  loader={<div>Loading Chart...</div>}
                  data={[
                    ['Date', 'Sales'],
                    ...summary.dailyOrders.map((x) => [x._id, x.sales]),
                  ]}
                ></Chart>
              )}
            </Col>
          </Row>
          <Row>
            <h1>Category</h1>

            <Col>
              {summary.productCategories.length === 0 ? (
                <Message>No Category</Message>
              ) : (
                <Chart
                  width='800px'
                  height='800px'
                  chartType='PieChart'
                  loader={<div>Loading Chart...</div>}
                  data={[
                    ['Category', 'Products'],
                    ...summary.productCategories.map((x) => [x._id, x.count]),
                  ]}
                ></Chart>
              )}
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default DashboardScreen;
