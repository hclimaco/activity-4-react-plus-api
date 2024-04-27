import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginScreen from './LoginScreen';
import ProductsPage from './ProductsPage';
import OrdersPage from './OrdersPage';
import NavigationBar from './NavigationBar';
import SignUpScreen from './SignUpScreen';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div>
        <NavigationBar isLoggedIn={isLoggedIn} />
        <Routes>
          <Route path="/login" exact element={<LoginScreen />} />
          <Route path="/signup" exact element={<SignUpScreen />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
