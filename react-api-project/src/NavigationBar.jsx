import React from 'react';
import { Link } from 'react-router-dom';
import './NavigationBar.css'; // Import CSS file

const NavigationBar = ({ isLoggedIn }) => {
  const handleLogout = () => {
    // Clear token from localStorage or perform any other logout-related actions
    localStorage.removeItem('token');
    // Redirect to login page
    window.location.href = '/login'; // You can also use history or any routing library here
  };

  return (
    <>
      {isLoggedIn ? (
        <div className="nav-container">
          <div className="store-name">Mandaue Foam</div>
          <nav>
            <ul className="nav-list">
              <li className="nav-item">
                <Link to="/products" className="nav-link">Products</Link>
              </li>
              <li className="nav-item">
                <Link to="/orders" className="nav-link">Orders</Link>
              </li>
            </ul>
          </nav>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      ) : null}
    </>
  );
};

export default NavigationBar;
