import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState('');
  const navigate = useNavigate();

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});
    setNotification('');

    // Custom validation logic
    const newErrors = {};
    if (!newPassword) {
      newErrors.newPassword = 'New Password is required';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required';
    }
    if (!otp) {
      newErrors.otp = 'OTP is required';
    }
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Call API to verify OTP and reset password
      const response = await axios.post('http://localhost:5000/reset-password', { otp, newPassword });
      setErrors({ form: response.data.message });
      setNotification('Password updated successfully');
      setTimeout(() => {
        setNotification('');
        navigate('/login'); // Redirect to login page after successful password reset
      }, 3000);
    } catch (error) {
      setErrors({ form: error.response?.data?.message || error.message });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      {notification && (
        <div className="bg-green-500 text-white py-2 px-4 mb-4 rounded">
          {notification}
        </div>
      )}
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6">Reset Password</h2>
        <form onSubmit={handleResetPasswordSubmit}>
          <div className="mb-4">
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="p-2 w-full border rounded"
            />
            {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword}</p>}
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="p-2 w-full border rounded"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="p-2 w-full border rounded"
            />
            {errors.otp && <p className="text-red-500 text-sm">{errors.otp}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Reset Password
          </button>
          {errors.form && <p className="text-red-500 text-sm mt-4">{errors.form}</p>}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;


