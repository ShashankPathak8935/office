import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "../Footer";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [selectedState, setSelectedState] = useState("Uttar Pradesh");
  const [totalPayableAmount, setTotalPayableAmount] = useState(0);
  const [notification, setNotification] = useState(""); // State for notification message
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/cart/${userId}`);
        setCartItems(response.data);
        calculateFoodCost(response.data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    if (userId) {
      fetchCartItems();
    }
  }, [userId]);

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      await axios.put(`http://localhost:5000/cart/${userId}/${itemId}`, {
        quantity: newQuantity,
      });
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
      calculateFoodCost(cartItems);
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
    }
  };

  const removeCartItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:5000/cart/${userId}/${itemId}`);
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== itemId)
      );
      calculateFoodCost(cartItems);
    } catch (error) {
      console.error("Error removing cart item:", error);
    }
  };

  useEffect(() => {
    calculateFoodCost(cartItems);
  }, [cartItems]);

  useEffect(() => {
    calculateTotalPayableAmount(totalCost);
  }, [totalCost, selectedState]);

  const calculateFoodCost = (items) => {
    const total = items.reduce(
      (acc, item) =>
        acc + item.price * item.quantity * ((100 - item.discount) / 100),
      0
    );
    setTotalCost(total);
  };

  const calculateGST = () => {
    const gst = selectedState === "Uttar Pradesh" ? 0.12 : 0.18;
    return (totalCost * gst).toFixed(2);
  };

  const calculateTotalPayableAmount = (foodCost) => {
    const gst = selectedState === "Uttar Pradesh" ? 0.12 : 0.18;
    const totalPayable = foodCost + foodCost * gst;
    setTotalPayableAmount(totalPayable);
  };

  const placeOrder = () => {
    navigate("/final-payment", {
      state: { totalPayableAmount, userId },
    });
  };
  

  const redirectToPurchaseHistory = () => {
    navigate("/purchase-history");
  };

  const redirectToProductProcessing = () => {
    navigate("/product-processing");
  };

  const handleQuantityChange = (itemId, operation) => {
    const itemToUpdate = cartItems.find((item) => item.id === itemId);
    if (!itemToUpdate) return;

    let newQuantity = itemToUpdate.quantity;
    if (operation === "increment") {
      newQuantity++;
    } else if (operation === "decrement") {
      newQuantity = Math.max(1, newQuantity - 1);
    }

    updateQuantity(itemId, newQuantity);
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen bg-blue-400">
        <div className="container mx-auto mt-8 flex-grow px-4 bg-gray-200 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4 bg-white p-4 shadow-sm rounded-lg">
            <h2 className="text-3xl font-bold text-gray-800">Cart items</h2>
            <div>
              <button
                onClick={redirectToProductProcessing}
                className="bg-purple-500 text-white px-4 py-2 rounded mr-2 hover:bg-purple-600 transition-colors"
              >
                Track Product
              </button>
              <button
                onClick={redirectToPurchaseHistory}
                className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition-colors"
              >
                Purchase History
              </button>
            </div>
          </div>
          {cartItems.length > 0 ? (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-200">
                  <tr className="text-center">
                    <th className="py-2 px-4">Product</th>
                    <th className="py-2 px-4">Name</th>
                    <th className="py-2 px-4">Price</th>
                    <th className="py-2 px-4">Discount</th> {/* Add discount column */}
                    <th className="py-2 px-4">Quantity</th>
                    <th className="py-2 px-4">Total</th>
                    <th className="py-2 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id} className="text-center border-t">
                      <td className="py-2 px-4">
                        <img
                          src={`http://localhost:5000/uploads/${item.photo}`}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="py-2 px-4">{item.name}</td>
                      <td className="py-2 px-4">
                        ${Number(item.price).toFixed(2)}
                      </td>
                      <td className="py-2 px-4">{item.discount}%</td> {/* Display discount */}
                      <td className="py-2 px-4 flex items-center justify-center space-x-2">
                        <button
                          className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400 transition-colors"
                          onClick={() =>
                            handleQuantityChange(item.id, "decrement")
                          }
                        >
                          <svg
                            className="h-4 w-4 text-gray-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 12H4"
                            />
                          </svg>
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400 transition-colors"
                          onClick={() =>
                            handleQuantityChange(item.id, "increment")
                          }
                        >
                          <svg
                            className="h-4 w-4 text-gray-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </button>
                      </td>
                      <td className="py-2 px-4">
                        ${((item.price * (1 - item.discount / 100)) * item.quantity).toFixed(2)}
                      </td>
                      <td className="py-2 px-4">
                        <button
                          onClick={() => removeCartItem(item.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-700 text-xl mt-8">
              Your cart is empty.
            </p>
          )}
        </div>
        <div className="container mx-auto mt-8 px-4 bg-gray-200 rounded-lg shadow-md py-4">
          <div className="text-right">
            <label className="mr-4 text-lg font-semibold text-gray-800">
              Select State:
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
            >
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="mt-4 text-right">
            <h2 className="text-xl font-semibold text-gray-800">
              Total Food Cost: ${totalCost.toFixed(2)}
            </h2>
            <h2 className="text-xl font-semibold text-gray-800">
              GST: ${calculateGST()}
            </h2>
            <h2 className="text-2xl font-bold text-gray-800">
              Total Payable Amount: ${totalPayableAmount.toFixed(2)}
            </h2>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={placeOrder}
              className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 transition-colors"
            >
              Place Order
            </button>
          </div>
        </div>
        {notification && ( // Conditionally render the notification message
          <div className="fixed bottom-0 left-0 right-0 bg-green-500 text-white text-center py-2">
            {notification}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Cart;
