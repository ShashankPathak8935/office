import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from './NavbarAdmin';

const Notification = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50">
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
  const [notification, setNotification] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

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
        setImage(response.data.image);
      } catch (error) {
        console.error(error.response.data.message);
      }
    };

    fetchUserDetails();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    const newErrors = {};
    if (!username) newErrors.username = 'Username is required';
    if (!email) newErrors.email = 'Email is required';
    if (!fullName) newErrors.fullName = 'Full Name is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
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

      setNotification('Profile updated successfully');
      setTimeout(() => {
        setNotification('');
        navigate('/adminhome');
      }, 3000); // Notification will disappear after 3 seconds
    } catch (error) {
      console.error(error.response.data.message);
      setNotification('Failed to update profile');
    }
  };

  return (
    <>
      <NavbarAdmin />
      <Notification message={notification} onClose={() => setNotification('')} />
      <div className="relative flex justify-center items-center h-screen bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('path_to_your_background_image.jpg')" }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative bg-white bg-opacity-90 p-8 md:p-12 rounded-lg shadow-md w-full max-w-md mx-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Update Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Full Name" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              {errors.fullName && <p className="text-red-500 text-sm absolute right-0 top-full">{errors.fullName}</p>}
            </div>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              {errors.email && <p className="text-red-500 text-sm absolute right-0 top-full">{errors.email}</p>}
            </div>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              {errors.username && <p className="text-red-500 text-sm absolute right-0 top-full">{errors.username}</p>}
            </div>
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Update
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateProfile;
