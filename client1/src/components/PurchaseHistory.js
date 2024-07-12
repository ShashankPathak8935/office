import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import StarRating from './StarRating';
import Navbar from './Navbar';
import Footer from '../Footer';

const PurchaseHistory = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [notification, setNotification] = useState({ message: '', type: '', visible: false });
  const navigate = useNavigate();
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchOrderHistory = async () => {
      const userId = localStorage.getItem('userId');

      try {
        const response = await axios.get(`http://localhost:5000/order-history/${userId}`, {
          params: { page: currentPage, limit: itemsPerPage },
        });
        setOrderHistory(response.data.orders);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order history:', error);
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, [currentPage]);

  const handleRatingChange = (orderId, value) => {
    setRatings(prevRatings => ({
      ...prevRatings,
      [orderId]: value,
    }));
  };

  const handleRatingSubmit = async (orderId) => {
    try {
      const userId = localStorage.getItem('userId');
      await axios.post(`http://localhost:5000/submit-rating`, {
        userId,
        orderId,
        rating: ratings[orderId],
      });
      showNotification('Rating submitted successfully', 'success');
    } catch (error) {
      console.error('Error submitting rating:', error);
      showNotification('Failed to submit rating', 'error');
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const showNotification = (message, type) => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification({ ...notification, visible: false });
    }, 3000);
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen bg-blue-400">
        <div className="container mx-auto mt-8 flex-grow">
          <h2 className="text-3xl font-bold mb-6 text-center">Purchase History</h2>
          {loading ? (
            <p className="text-center text-xl">Loading...</p>
          ) : orderHistory.length === 0 ? (
            <p className="text-center text-xl">No order history found.</p>
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-200">
                  <tr className="text-center border-b">
                    <th className="py-4 px-6">Order ID</th>
                    <th className="py-4 px-6">Product Image</th>
                    <th className="py-4 px-6">Product ID</th>
                    <th className="py-4 px-6">Quantity</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Date</th>
                    <th className="py-4 px-6">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {orderHistory.map(order => (
                    <tr key={order.id} className="text-center border-t">
                      <td className="py-4 px-6">{order.order_id}</td>
                      <td className="py-4 px-6">
                        <img src={`http://localhost:5000/uploads/${order.photo}`} alt="Product" className="w-16 h-16 mx-auto rounded-md" />
                      </td>
                      <td className="py-4 px-6">{order.product_id}</td>
                      <td className="py-4 px-6">{order.quantity}</td>
                      <td className="py-4 px-6">{order.status}</td>
                      <td className="py-4 px-6">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="py-4 px-6">
                        {order.status === 'accepted' ? (
                          <>
                            <StarRating
                              rating={ratings[order.id] || 0}
                              onRatingChange={(value) => handleRatingChange(order.id, value)}
                            />
                            <button
                              onClick={() => handleRatingSubmit(order.id)}
                              className="ml-2 bg-blue-500 text-white px-3 py-1 rounded"
                            >
                              Submit
                            </button>
                          </>
                        ) : (
                          <p>N/A</p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-center py-4 bg-gray-200">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 mx-1 bg-gray-300 rounded hover:bg-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-4 py-2 mx-1">{currentPage}</span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 mx-1 bg-gray-300 rounded hover:bg-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
        {notification.visible && (
          <div
            className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-md ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white`}
          >
            {notification.message}
          </div>
        )}
        <Footer />
      </div>
    </>
  );
};

export default PurchaseHistory;
