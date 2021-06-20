import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const SearchBox = ({ history }) => {
  const [name, setName] = useState('');
  const trim = name.trim();
  const submitHandler = (e) => {
    e.preventDefault();
    if (name.trim()) {
      history.push(`/search/name/${name}`);
    }
    history.push(`/search/name/${name}`);
  };

  return (
    <Form onSubmit={submitHandler} inline>
      <Form.Control
        type='text'
        name='q'
        id='q'
        onChange={(e) => setName(e.target.value)}
        placeholder='Search Products...'
        className='mr-sm-2 ml-sm-5'
      ></Form.Control>
      <Button type='submit' variant='outline-success' className='p-2'>
        Search
      </Button>
    </Form>
  );
};

export default SearchBox;
