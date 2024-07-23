import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const FinalPayment = () => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false); // State to manage order success
  const [orderFailed, setOrderFailed] = useState(false); // State to manage order failure
  const navigate = useNavigate();
  const location = useLocation();
  const { totalPayableAmount, userId } = location.state;

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handlePayment = async () => {
    // Convert amount and totalPayableAmount to fixed decimal places for comparison
    const amountNumber = parseFloat(amount).toFixed(2);
    const totalAmountNumber = totalPayableAmount.toFixed(2);

    if (amountNumber === totalAmountNumber) {
      try {
        await axios.post(`http://localhost:5000/place-order/${userId}`);
        setOrderSuccess(true); // Set orderSuccess to true on successful payment
        setTimeout(() => {
          navigate("/product-processing"); // Navigate to order success page
        }, 3000); // Delay to allow user to see the success message
      } catch (error) {
        console.error("Error placing order:", error);
        setOrderFailed(true); // Set orderFailed to true on error
      }
    } else {
      setError("Incorrect amount. Please enter the exact total payable amount.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {orderSuccess ? (
        <div className="bg-green-100 p-6 rounded shadow-md w-80 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4 text-green-600">Order Placed Successfully!</h2>
          <p className="text-center">Thank you for your order. Your order has been placed successfully.</p>
        </div>
      ) : orderFailed ? (
        <div className="bg-red-100 p-6 rounded shadow-md w-80 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Order Failed!</h2>
          <p className="text-center">There was an error placing your order. Please try again.</p>
        </div>
      ) : (
        <div className="bg-gray-100 p-6 rounded shadow-md w-80">
          <h2 className="text-2xl font-bold mb-4">Enter Payment Amount</h2>
          <p className="text-lg mb-4">Total Payable Amount: ${totalPayableAmount.toFixed(2)}</p>
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            className="w-full p-2 border rounded mb-4"
            placeholder="Enter amount"
          />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            onClick={handlePayment}
            className="bg-green-500 text-white w-full p-2 rounded hover:bg-green-600"
          >
            Submit Payment
          </button>
        </div>
      )}
    </div>
  );
};

export default FinalPayment;
