import React, { useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';

const Searchbox = ({ history }) => {
  const [keyword, setKeyword] = useState('');

  const handleSearchChange = (e) => {
    e.preventDefault();

    if (keyword.trim()) {
      history.push(`/admin/coupons/search/keyword/${keyword}`);
    } else {
      history.push('/admin/coupons');
    }
  };
  return (
    <Row>
      <Col>
        <Form onSubmit={handleSearchChange} inline className='mb-3'>
          <Form.Group controlId='name'>
            <Form.Control
              type='text'
              name='q'
              placeholder='Search coupon...'
              onChange={(e) => setKeyword(e.target.value)}
              autoFocus
            ></Form.Control>
            <Button type='submit' className='ml-3'>
              Search
            </Button>
          </Form.Group>
        </Form>
      </Col>
    </Row>
  );
};

export default Searchbox;
