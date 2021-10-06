import React from 'react';
import { Row, Col, Form } from 'react-bootstrap';

const localSearch = ({ keyword, setKeyword }) => {
  const handleSearchChange = (e) => {
    e.preventDefault();
    setKeyword(e.target.value.toLowerCase());
  };
  return (
    <div>
      <Row>
        <Col>
          <Form>
            <Form.Group controlId='name'>
              <Form.Control
                type='text'
                placeholder='Filter'
                value={keyword}
                onChange={handleSearchChange}
                autoFocus
                required
              ></Form.Control>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default localSearch;
