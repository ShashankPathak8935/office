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
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: '', type: '' });
    }, 3000);
  };

  const validateLogin = () => {
    const newErrors = {};
    if (!username.trim()) newErrors.username = 'Username is required';
    if (!password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const validateForgotPassword = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) newErrors.email = 'Invalid email address';
    return newErrors;
  };

  const validateOtp = () => {
    const newErrors = {};
    if (!otp.trim()) newErrors.otp = 'OTP is required';
    return newErrors;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateLogin();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

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
    const formErrors = validateForgotPassword();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

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
    const formErrors = validateOtp();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/verify-otp', { email, otp });
      showNotification('OTP verified successfully', 'green');
      setTimeout(() => {
        navigate('/reset-password');
      }, 3000);
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
                className={`mb-4 p-3 w-full border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.username ? 'border-red-500' : ''}`}
              />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`mb-4 p-3 w-full border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : ''}`}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
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
                <>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className={`mb-4 p-3 w-full border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.otp ? 'border-red-500' : ''}`}
                  />
                  {errors.otp && <p className="text-red-500 text-xs mt-1">{errors.otp}</p>}
                </>
              ) : (
                <>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`mb-4 p-3 w-full border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </>
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
