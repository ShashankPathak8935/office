import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "../Footer";
import { FaTrash } from "react-icons/fa"; // Import icon for delete button

const ProductProcessing = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(""); // State for notification
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchPendingOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/pending-orders/${userId}`
        );
        setPendingOrders(response.data);
      } catch (error) {
        console.error("Error fetching pending orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchPendingOrders();
    }
  }, [userId]);



  const deleteAllOrders = async () => {
    console.log("Deleting orders for user:", userId); // Add this line to check userId
    try {
      const response = await axios.delete(`http://localhost:5000/orders/${userId}`);
      console.log("Delete response:", response.data); // Add this line to check response
      setPendingOrders([]);
      setNotification("Your order is cancelled successfully");
      setTimeout(() => {
        setNotification("");
      }, 3000);
    } catch (error) {
      console.error("Error deleting orders:", error);
    }
  };



  

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen bg-blue-400">
        <div className="container mx-auto mt-8 flex flex-col items-center justify-center flex-grow">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Product Processing
          </h2>
          {loading ? (
            <p className="text-gray-700 text-center">Loading...</p>
          ) : pendingOrders.length > 0 ? (
            <div className="bg-white shadow-md rounded-lg overflow-hidden w-full max-w-4xl">
              <table className="min-w-full">
                <thead>
                  <tr className="text-center border-t">
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingOrders.map((item) => (
                    <tr key={item.order_id} className="text-center border-t">
                      <td className="py-3 px-4">{item.order_id}</td>
                      <td className="py-3 px-4">
                        <img
                          src={`http://localhost:5000/uploads/${item.photo}`}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="py-3 px-4">{item.name}</td>
                      <td className="py-3 px-4">
                        ${Number(item.price).toFixed(2)}
                      </td>
                      <td className="py-3 px-4">{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-center mt-6">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded flex items-center justify-center"
                  onClick={deleteAllOrders}
                >
                  <FaTrash className="mr-2" />
                  Delete Orders
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 text-center mt-6">
              your All orders has been succesfully delivered <br />
              Add New items in your Cart.
            </p>
          )}
          {notification && (
            <div className="mt-4 bg-green-200 text-green-800 py-2 px-4 rounded">
              {notification}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default ProductProcessing;
