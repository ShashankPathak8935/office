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
      (acc, item) => acc + item.price * item.quantity,
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

  const placeOrder = async () => {
    try {
      await axios.post(`http://localhost:5000/place-order/${userId}`);
      console.log("Order placed successfully");
      setNotification("Order placed successfully!"); // Set notification message
      setTimeout(() => {
        setNotification(""); // Clear notification after 3 seconds
        navigate("/product-processing"); // Navigate to the product processing page
      }, 3000);
    } catch (error) {
      console.error("Error placing order:", error);
      setNotification("Error placing order. Please try again."); // Set error notification message
      setTimeout(() => setNotification(""), 3000); // Clear notification after 3 seconds
    }
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
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                        </button>
                      </td>
                      <td className="py-2 px-4">
                        ${(Number(item.price) * item.quantity).toFixed(2)}
                      </td>
                      <td className="py-2 px-4">
                        <button
                          onClick={() => removeCartItem(item.id)}
                          className="text-white-500 hover:text-white-600  py-2 rounded bg-red-500"
                        >
                          Remove item
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 flex justify-end bg-gray-50 border-t">
                <div className="flex items-center">
                  <span className="font-semibold mr-2">Select State:</span>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end p-4">
                <div className="bg-white shadow-md p-4 rounded-lg w-64">
                  <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                  <p className="flex justify-between mb-2">
                    <span>Food Cost:</span>
                    <span>${totalCost.toFixed(2)}</span>
                  </p>
                  <p className="flex justify-between mb-2">
                    <span>GST:</span>
                    <span>${calculateGST()}</span>
                  </p>
                  <p className="flex justify-between font-bold">
                    <span>Total Payable:</span>
                    <span>${totalPayableAmount.toFixed(2)}</span>
                  </p>
                  <button
                    onClick={placeOrder}
                    className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600 transition-colors w-full"
                  >
                    Place Order
                  </button>
                  {notification && (
                    <p className="mt-4 text-center text-white bg-green-500 rounded py-2">
                      {notification}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center">Your cart is empty.</p>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Cart;

