import React, { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { Container } from 'react-bootstrap';
import HomeScreen from './screens/HomeScreen';
import DashboardScreen from './screens/DashboardScreen';
import SearchScreen from './screens/SearchScreen';
import ProductScreen from './screens/ProductScreen';
import CategoryListScreen from './screens/CategoryListScreen';
import CategoryEditScreen from './screens/CategoryEditScreen';
import SubCategoryListScreen from './screens/SubCategoryListScreen';
import SubCategoryEditScreen from './screens/SubCategoryEditScreen';
import BrandListScreen from './screens/BrandListScreen';
import BrandEditScreen from './screens/BrandEditScreen';
import CouponListScreen from './screens/CouponListScreen';
import CouponEditScreen from './screens/CouponEditScreen';
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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-day-picker/lib/style.css';
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(listProductCategories());
  }, [dispatch]);
  return (
    <Router>
      <Header />
      <ToastContainer />
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
            path='/admin/productlist/pageNumber/:pageNumber'
            component={ProductListScreen}
            exact
          />
          <Route path='/product/:id' component={ProductScreen} />
          <Route
            path='/admin/categories'
            component={CategoryListScreen}
            exact
          />
          <Route
            path='/admin/categories/search/keyword/:keyword'
            component={CategoryListScreen}
            exact
          />
          <Route
            path='/admin/categories/page/:pageNumber'
            component={CategoryListScreen}
            exact
          />
          <Route
            path='/admin/categories/search/keyword/:keyword/page/:pageNumber'
            component={CategoryListScreen}
            exact
          />
          <Route
            path='/admin/categories/:id/edit'
            component={CategoryEditScreen}
            exact
          />
          <Route
            path='/admin/subcategories'
            component={SubCategoryListScreen}
            exact
          />
          <Route
            path='/admin/subcategories/search/keyword/:keyword'
            component={SubCategoryListScreen}
            exact
          />
          <Route
            path='/admin/subcategories/page/:pageNumber'
            component={SubCategoryListScreen}
            exact
          />
          <Route
            path='/admin/subcategories/search/keyword/:keyword/page/:pageNumber'
            component={SubCategoryListScreen}
            exact
          />
          <Route
            path='/admin/subcategories/:id/edit'
            component={SubCategoryEditScreen}
            exact
          />
          <Route path='/admin/brands' component={BrandListScreen} exact />
          <Route
            path='/admin/brands/:id/edit'
            component={BrandEditScreen}
            exact
          />
          <Route
            path='/admin/brands/search/keyword/:keyword'
            component={BrandListScreen}
            exact
          />
          <Route
            path='/admin/brands/page/:pageNumber'
            component={BrandListScreen}
            exact
          />
          <Route
            path='/admin/brands/search/keyword/:keyword/page/:pageNumber'
            component={BrandListScreen}
            exact
          />
          <Route path='/admin/coupons' component={CouponListScreen} exact />
          <Route
            path='/admin/coupons/:id/edit'
            component={CouponEditScreen}
            exact
          />{' '}
          <Route
            path='/admin/coupons/search/keyword/:keyword'
            component={CouponListScreen}
            exact
          />
          <Route
            path='/admin/coupons/page/:pageNumber'
            component={CouponListScreen}
            exact
          />
          <Route
            path='/admin/coupons/search/keyword/:keyword/page/:pageNumber'
            component={CouponListScreen}
            exact
          />
          <Route path='/admin/dashboard' component={DashboardScreen} />
          <Route path='/profile' component={ProfileScreen} />
          <Route path='/map' component={MapScreen} />
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
            path='/search/category/:category/name/:name/min/:min/max/:max/rating/:rating/order/:order/pageNumber/:pageNumber'
            component={SearchScreen}
            exact
          />
          <Route path='/page/:pageNumber' component={HomeScreen} exact />
          <Route
            path='/search/name/:name/page/:pageNumber'
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
