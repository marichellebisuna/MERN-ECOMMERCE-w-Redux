import React, { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { Container } from 'react-bootstrap';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import { listProductCategories } from './actions/productActions';
import { useDispatch } from 'react-redux';
import MapScreen from './screens/MapScreen';

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(listProductCategories());
  }, [dispatch]);
  return (
    <Router>
      <Header />

      <main className='py-3'>
        <Container>
          <Route path='/order/:id' component={OrderScreen} />
          <Route path='/login' component={LoginScreen} />
          <Route path='/register' component={RegisterScreen} />
          <Route path='/shipping' component={ShippingScreen} />
          <Route path='/payment' component={PaymentScreen} />
          <Route path='/placeorder' component={PlaceOrderScreen} />
          <Route path='/admin/orderlist' component={OrderListScreen} />
          <Route path='/admin/userlist' component={UserListScreen} />
          <Route path='/admin/user/:id/edit' component={UserEditScreen} />
          <Route
            path='/admin/productlist'
            component={ProductListScreen}
            exact
          />
          <Route
            path='/admin/product/:id/edit'
            component={ProductEditScreen}
            exact
          />
          <Route
            path='/admin/productlist/:pageNumber'
            component={ProductListScreen}
            exact
          />
          <Route path='/profile' component={ProfileScreen} />
          <Route path='/map' component={MapScreen} />
          <Route path='/product/:id' component={ProductScreen} />
          <Route path='/cart/:id?' component={CartScreen} />
          <Route path='/' component={HomeScreen} exact />
          <Route path='/search/name/:name?' component={SearchScreen} exact />
          <Route
            path='/search/category/:category'
            component={SearchScreen}
            exact
          />
          <Route
            path='/search/category/:category/name/:name'
            component={SearchScreen}
            exact
          />
          <Route
            path='/search/category/:category/name/:name/min/:min/max/:max/rating/:rating/order/:order'
            component={SearchScreen}
            exact
          />
          <Route path='/page/:pageNumber' component={HomeScreen} exact />
          <Route
            path='/search/:keyword/page/:pageNumber'
            component={HomeScreen}
            exact
          />
        </Container>
      </main>

      <Footer />
    </Router>
  );
}

export default App;
