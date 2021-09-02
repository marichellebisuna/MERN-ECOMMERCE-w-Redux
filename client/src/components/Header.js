import React, { useState, useEffect } from 'react';
import { Route } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../actions/userActions';
import SearchBox from './SearchBox';
import { Link, useParams } from 'react-router-dom';
import { listProducts } from '../actions/productActions';
import Message from './Message';
import Loader from './Loader';

const Header = () => {
  const { name = 'all', category = 'all' } = useParams();
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const cart = useSelector((state) => state.cart);
  const { shoppingCart } = cart;
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

  const productCategoryList = useSelector((state) => state.productCategoryList);
  const {
    loading: loadingCategories,
    error: errorCategories,
    categories,
  } = productCategoryList;

  const logoutHandler = () => {
    dispatch(logout());
  };

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
      <header>
        <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
          <Container>
            <button
              type='button'
              className='open-sidebar'
              onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
            >
              <i className='fa fa-bars'></i>
            </button>
            <LinkContainer to='/'>
              <Navbar.Brand>MERN Shop w/ Redux</Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls='basic-navbar-nav' />
            <Navbar.Collapse id='basic-navbar-nav'>
              <Route
                render={({ history }) => <SearchBox history={history} />}
              />
              <Nav className='ml-auto'>
                <LinkContainer to='/cart'>
                  <Nav.Link>
                    <i className='fas fa-shopping-cart'></i>
                    <span className='pl-1'>Cart</span>
                    {shoppingCart.length > 0 && (
                      <span className='badge'>{shoppingCart.length}</span>
                    )}
                  </Nav.Link>
                </LinkContainer>
                {userInfo ? (
                  <NavDropdown title={userInfo.name} id='username'>
                    <LinkContainer to='/profile'>
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    {/* <LinkContainer to='/wishlist'>
                      <NavDropdown.Item>Wishlist</NavDropdown.Item>
                    </LinkContainer> */}
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <LinkContainer to='/login'>
                    <Nav.Link>
                      <i className='fas fa-user'></i>Sign In
                    </Nav.Link>
                  </LinkContainer>
                )}
                {userInfo && userInfo.isAdmin && (
                  <NavDropdown title='Admin' id='adminmenu'>
                    <LinkContainer to='/admin/userlist'>
                      <NavDropdown.Item>Users</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='/admin/productlist'>
                      <NavDropdown.Item>Products</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='/admin/brands'>
                      <NavDropdown.Item>Brands</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='/admin/categories'>
                      <NavDropdown.Item>Categories</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='/admin/subcategories'>
                      <NavDropdown.Item>Sub Categories</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='/admin/coupon'>
                      <NavDropdown.Item>Coupon</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='/user/password'>
                      <NavDropdown.Item>Password</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='/admin/orderlist'>
                      <NavDropdown.Item>Orders</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='/admin/dashboard'>
                      <NavDropdown.Item>Dashboard</NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>

      <aside className={sidebarIsOpen ? 'open' : ''}>
        <ul className='padcat '>
          <li>
            <h5 className='float-left '>Categories</h5>
            <button
              onClick={() => setSidebarIsOpen(false)}
              className='close-sidebar '
              type='button'
            >
              <i className='fas fa-times'></i>
            </button>
          </li>
          {loadingCategories ? (
            <Loader />
          ) : errorCategories ? (
            <Message variant='danger'>{errorCategories}</Message>
          ) : (
            categories.map((c) => (
              <li key={c}>
                <Link
                  className={c === category ? 'active' : ''}
                  to={getFilterUrl({ category: c })}
                  onClick={() => setSidebarIsOpen(false)}
                >
                  {c}
                </Link>
              </li>
            ))
          )}
        </ul>
      </aside>
    </>
  );
};

export default Header;
