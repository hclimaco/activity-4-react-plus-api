import React, { useState, useEffect } from 'react';
import NavigationBar from './NavigationBar';
import './OrdersPage.css'; // Import CSS file for styling

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setErrorMessage('Authorization token not found.');
            return;
        }

        fetch('http://localhost:3000/orders', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch orders.');
                }
                return response.json();
            })
            .then(data => {
                setOrders(data.orders);
            })
            .catch(error => {
                console.error('Error fetching orders:', error);
                setErrorMessage('Failed to fetch orders. Please try again later.');
            });
    };

    const handleDelete = (orderId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setErrorMessage('Authorization token not found.');
            return;
        }

        fetch(`http://localhost:3000/orders/${orderId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete order.');
                }
                // If deletion is successful, remove the order from the state
                setOrders(orders.filter(order => order._id !== orderId));
            })
            .catch(error => {
                console.error('Error deleting order:', error);
                setErrorMessage('Failed to delete order. Please try again later.');
            });
    };

    return (
        <div>
            <NavigationBar isLoggedIn={true} />
            <h2>Orders</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div className="card-container">
                {orders.map(order => (
                    <div key={order._id} className="card">
                        <button className="delete-button" onClick={() => handleDelete(order._id)}>Delete</button>
                        <div className="card-body">
                            <h3>{order.product ? order.product.name : 'Product Name Not Available'}</h3>
                            {order.product && order.product.productImage && <img src={`http://localhost:3000/${order.product.productImage}`} alt={order.product.name} />}
                            <p>Quantity: {order.quantity}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrdersPage;
