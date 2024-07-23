import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavbarAdmin from './NavbarAdmin';

const OrderRequest = () => {
  const [orders, setOrders] = useState([]);
  const [notification, setNotification] = useState(""); // State for notification message
  const [isError, setIsError] = useState(false); // State to track error

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/pending-orders', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };
    fetchOrders();
  }, []);

  const handleAcceptUserOrders = async (userId) => {
    try {
      const response = await axios.put(`http://localhost:5000/users/${userId}/accept-orders`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.success) {
        setNotification("Order is accepted");
        setIsError(false); // No error
        window.location.reload(); // Refresh the page
      }
    } catch (err) {
      console.error('Error accepting orders:', err);
      setNotification("Error accepting order. Please try again.");
      setIsError(true); // Set error state
    }
    setTimeout(() => {
      setNotification("");
      setIsError(false); // Reset error state
    }, 3000); // Clear notification after 3 seconds
  };

  const handleCancelUserOrders = async (userId) => {
    try {
      const response = await axios.put(`http://localhost:5000/users/${userId}/cancel-orders`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.success) {
        setNotification("Order is cancelled");
        setIsError(false); // No error
        window.location.reload(); // Refresh the page
      }
    } catch (err) {
      console.error('Error canceling orders:', err);
      setNotification("Error cancelling order. Please try again.");
      setIsError(true); // Set error state
    }
    setTimeout(() => {
      setNotification("");
      setIsError(false); // Reset error state
    }, 3000); // Clear notification after 3 seconds
  };

  const groupedOrders = orders.reduce((acc, order) => {
    if (!acc[order.user_id]) {
      acc[order.user_id] = [];
    }
    acc[order.user_id].push(order);
    return acc;
  }, {});

  return (
    <>
      <NavbarAdmin />
      {notification && (
        <div className={`fixed top-0 left-0 w-full text-center py-2 z-50 ${isError ? 'bg-red-500' : 'bg-green-500'} text-white`}>
          {notification}
        </div>
      )}
      <div className="container mx-auto mt-8 bg-blue-400 p-6 rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Order Requests</h2>
        {Object.keys(groupedOrders).length > 0 ? (
          Object.keys(groupedOrders).map(userId => (
            <div key={userId} className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
              <h3 className="text-2xl font-semibold p-4 bg-green-200 text-gray-700">User ID: {userId}</h3>
              <table className="min-w-full">
                <thead>
                  <tr className="text-center border-b">
                    <th className="py-3 px-4 bg-gray-50">Product</th>
                    <th className="py-3 px-4 bg-gray-50">Name</th>
                    <th className="py-3 px-4 bg-gray-50">Price</th>
                    <th className="py-3 px-4 bg-gray-50">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedOrders[userId].map(order => (
                    <tr key={order.order_id} className="text-center border-b">
                      <td className="py-3 px-4">
                        <img
                          src={`http://localhost:5000/uploads/${order.photo}`}
                          alt={order.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="py-3 px-4">{order.name}</td>
                      <td className="py-3 px-4">${Number(order.price).toFixed(2)}</td>
                      <td className="py-3 px-4">{order.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-end p-4 bg-gray-100">
                <button
                  onClick={(e) => {
                    e.preventDefault(); // Prevent any default behavior
                    handleAcceptUserOrders(userId);
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded mr-2 transition duration-200"
                >
                  Accept Orders
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault(); // Prevent any default behavior
                    handleCancelUserOrders(userId);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition duration-200"
                >
                  Cancel Orders
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-700">No pending orders found.</p>
        )}
      </div>
    </>
  );
};

export default OrderRequest;
