import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [userIds, setUserIds] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedUsername, setSelectedUsername] = useState('');
  const [date, setDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const ordersPerPage = 10;

  useEffect(() => {
    fetchOrders();
    fetchUserIds();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [selectedUserId, date, currentPage]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders', {
        params: { userId: selectedUserId || null, date: date || null, page: currentPage, limit: ordersPerPage },
      });
      setOrders(response.data.orders);
      setTotalOrders(response.data.totalOrders);
    } catch (error) {
      console.error('Error fetching order history:', error);
    }
  };

  const fetchUserIds = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUserIds(response.data);
    } catch (error) {
      console.error('Error fetching user IDs:', error);
    }
  };

  const totalPages = Math.ceil(totalOrders / ordersPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const fetchAllOrders = async () => {
    let allOrders = [];
    const totalPages = Math.ceil(totalOrders / ordersPerPage);

    for (let page = 1; page <= totalPages; page++) {
      const response = await axios.get('http://localhost:5000/api/orders', {
        params: { userId: selectedUserId || null, date: date || null, page: page, limit: ordersPerPage },
      });
      allOrders = allOrders.concat(response.data.orders);
    }

    return allOrders;
  };

  const downloadPDF = async () => {
    try {
      const allOrders = await fetchAllOrders();

      const doc = new jsPDF('p', 'pt', 'a4');
      const rowsPerPage = 30; // Number of rows per page
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 40;
      const cellWidth = (pageWidth - margin * 2) / 7; // 7 columns
      let rowCount = 0;

      const generateTableHeaders = () => {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Order ID', margin, margin);
        doc.text('User ID', margin + cellWidth, margin);
        doc.text('Product ID', margin + cellWidth * 2, margin);
        doc.text('Quantity', margin + cellWidth * 3, margin);
        doc.text('Status', margin + cellWidth * 4, margin);
        doc.text('Created At', margin + cellWidth * 5, margin);
        doc.text('Rating', margin + cellWidth * 6, margin);
      };

      const generateTableContent = (orders, startY) => {
        doc.setFont('helvetica', 'normal');
        orders.forEach((order, index) => {
          const y = startY + index * 20;
          doc.text(order.order_id?.toString() || '', margin, y);
          doc.text(order.user_id?.toString() || '', margin + cellWidth, y);
          doc.text(order.product_id?.toString() || '', margin + cellWidth * 2, y);
          doc.text(order.quantity?.toString() || '', margin + cellWidth * 3, y);
          doc.text(order.status || '', margin + cellWidth * 4, y);
          doc.text(new Date(order.created_at).toLocaleDateString() || '', margin + cellWidth * 5, y);
          doc.text(order.rating?.toString() || '', margin + cellWidth * 6, y);
        });
      };

      for (let i = 0; i < allOrders.length; i += rowsPerPage) {
        const chunk = allOrders.slice(i, i + rowsPerPage);
        if (rowCount > 0) {
          doc.addPage();
        }
        generateTableHeaders();
        generateTableContent(chunk, margin + 20);
        rowCount += chunk.length;
      }

      doc.save('order-history.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-blue-500 p-4 rounded-lg shadow-md mb-4">
        <h1 className="text-2xl font-bold mb-2 text-white">Order History</h1>
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search by Username"
              value={selectedUsername}
              onChange={(e) => setSelectedUsername(e.target.value)}
              className="p-2 border rounded w-64 focus:outline-none focus:border-blue-500"
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="p-2 border rounded focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            onClick={downloadPDF}
            className="px-4 py-2 bg-green-500 text-white rounded shadow-md hover:bg-red-600 focus:outline-none"
          >
            Download PDF
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-100 rounded-lg overflow-hidden">
          <thead className="bg-green-800 text-white">
            <tr>
              <th className="py-2 px-4">Order ID</th>
              <th className="py-2 px-4">User ID</th>
              <th className="py-2 px-4">Product ID</th>
              <th className="py-2 px-4">Quantity</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Created At</th>
              <th className="py-2 px-4">Rating</th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-200">
                  <td className="py-2 px-4">{order.order_id}</td>
                  <td className="py-2 px-4">{order.user_id}</td>
                  <td className="py-2 px-4">{order.product_id}</td>
                  <td className="py-2 px-4">{order.quantity}</td>
                  <td className="py-2 px-4">{order.status}</td>
                  <td className="py-2 px-4">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="py-2 px-4">{order.rating}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-4 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded shadow-md ${currentPage === 1 ? 'bg-green-800 text-white cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600 focus:outline-none'}`}
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages || orders.length === 0}
          className={`px-4 py-2 rounded shadow-md ${currentPage === totalPages || orders.length === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600 focus:outline-none'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OrderHistory;


