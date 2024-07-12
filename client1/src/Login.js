import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Notification = ({ message, type, onClose }) => {
  if (!message) return null;

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 bg-${type}-500 text-white px-4 py-2 rounded shadow-lg`}>
      <span>{message}</span>
      <button className="ml-2 text-white" onClick={onClose}>x</button>
    </div>
  );
};

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const navigate = useNavigate();

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 3000);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', { username, password });
      localStorage.setItem('userId', response.data.id);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', username);
      localStorage.setItem('userImage', response.data.userImage);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('email', response.data.email);

      if (response.data.role === 'admin') {
        navigate('/adminhome');
      } else {
        navigate('/home');
      }
    } catch (error) {
      console.error(error.response.data.message);
      showNotification(error.response.data.message, 'red');
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/forgot-password', { email });
      setIsOtpSent(true);
      showNotification(response.data.message, 'green');
    } catch (error) {
      console.error(error.response.data.message);
      showNotification(error.response.data.message, 'red');
    }
  };

  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/verify-otp', { email, otp });
      showNotification(response.data.message, 'green');
      navigate('/reset-password');
    } catch (error) {
      console.error(error.response.data.message);
      showNotification(error.response.data.message, 'red');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-500 to-gray-300">
      <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ message: '', type: '' })} />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        {!isForgotPassword ? (
          <>
            <h2 className="text-3xl font-bold mb-6">Login</h2>
            <form onSubmit={handleLoginSubmit}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mb-4 p-3 w-full border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mb-4 p-3 w-full border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-lg shadow-md hover:bg-blue-600 transition-colors"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="w-full mt-2 bg-gray-500 text-white py-3 rounded-lg shadow-md hover:bg-gray-600 transition-colors"
              >
                Don't have an Account?
              </button>
              <button
                type="button"
                onClick={() => setIsForgotPassword(true)}
                className="w-full mt-2 text-blue-500 hover:underline"
              >
                Forgot Password?
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-6">{isOtpSent ? 'Verify OTP' : 'Forgot Password'}</h2>
            <form onSubmit={isOtpSent ? handleVerifyOtpSubmit : handleForgotPasswordSubmit}>
              {isOtpSent ? (
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="mb-4 p-3 w-full border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mb-4 p-3 w-full border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-lg shadow-md hover:bg-blue-600 transition-colors"
              >
                {isOtpSent ? 'Verify OTP' : 'Send OTP'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(false);
                  setIsOtpSent(false);
                }}
                className="w-full mt-2 bg-gray-500 text-white py-3 rounded-lg shadow-md hover:bg-gray-600 transition-colors"
              >
                {isOtpSent ? 'Back to Forgot Password' : 'Back to Login'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginForm;


