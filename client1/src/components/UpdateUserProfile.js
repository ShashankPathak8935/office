import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from '../Footer';

const Notification = ({ message, type, onClose }) => {
  if (!message) return null;

  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 bg-${type}-500 text-white px-4 py-2 rounded shadow-lg`}>
      <span>{message}</span>
      <button className="ml-2 text-white" onClick={onClose}>x</button>
    </div>
  );
};

const UpdateProfile = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [image, setImage] = useState(null);
  const [currentImagePath, setCurrentImagePath] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: '', type: '' });
      if (type === 'green') {
        navigate('/home');
      }
    }, 3000); // Adjust the delay as needed
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/user-details', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUsername(response.data.username);
        setEmail(response.data.email);
        setFullName(response.data.full_name);
        setCurrentImagePath(response.data.image); // Set current image path
      } catch (error) {
        console.error(error.response.data.message);
      }
    };

    fetchUserDetails();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = 'Full Name is required.';
    if (!email.trim()) newErrors.email = 'Email is required.';
    if (!username.trim()) newErrors.username = 'Username is required.';
    // Add more validation rules as needed

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('fullName', fullName);
    if (image) formData.append('image', image);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/update-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      localStorage.setItem('username', response.data.username);
      localStorage.setItem('email', response.data.email);
      localStorage.setItem('fullName', response.data.full_name);
      if (response.data.image) {
        localStorage.setItem('userImage', response.data.image);
      }
      showNotification('Profile updated successfully', 'green');
    } catch (error) {
      console.error(error.response.data.message);
      showNotification(error.response.data.message, 'red');
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen">
        <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ message: '', type: '' })} />
        <div className="flex justify-center items-center h-screen bg-gray-100 flex-grow">
          <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
            <h2 className="text-2xl font-bold mb-6">Update Profile</h2>
            <form onSubmit={handleSubmit}>
              <input 
                type="text" 
                placeholder="Full Name" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                className={`mb-4 p-2 w-full border rounded ${errors.fullName ? 'border-red-500' : ''}`}
              />
              {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}

              <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className={`mb-4 p-2 w-full border rounded ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

              <input 
                type="text" 
                placeholder="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                className={`mb-4 p-2 w-full border rounded ${errors.username ? 'border-red-500' : ''}`}
              />
              {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}

              <p className="mb-4 text-gray-600">Current Image Path: {currentImagePath}</p>
              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                className="mb-4 p-2 w-full border rounded"
              />
              <button 
                type="submit" 
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Update
              </button>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default UpdateProfile;
