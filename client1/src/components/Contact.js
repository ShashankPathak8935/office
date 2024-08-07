import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from '../Footer';
import cardImage from '../images/contact1.png'; 
import headerImage from '../images/contactus1.avif'; 
import { FaFacebook, FaInstagram, FaPhoneSquareAlt } from 'react-icons/fa';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    food: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState('');

  const validate = () => {
    const errors = {};
    if (!formData.name) errors.name = 'Name is required.';
    if (!formData.email) {
      errors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email address is invalid.';
    }
    if (!formData.food) errors.food = 'Favorite food is required.';
    if (!formData.message) errors.message = 'Message is required.';
    return errors;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setNotification('Thank you for contacting us!');
        setFormData({ name: '', email: '', food: '', message: '' });
        setTimeout(() => setNotification(''), 5000); // Clear the notification after 5 seconds
      } else {
        setNotification('Failed to submit form.');
      }
    } catch (error) {
      console.error('Error:', error);
      setNotification('Error submitting form.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen">
        {notification && (
          <div className="fixed top-0 left-0 w-full bg-green-500 text-white text-center p-2">
            {notification}
          </div>
        )}
        <div className="relative h-screen md:h-[75vh] flex-grow">
          <img src={headerImage} alt="Header" className="absolute w-full h-full object-cover" />
        </div>

        <div className="mt-8 max-w-6xl mx-auto flex items-center space-x-4">
          <h2 className="text-4xl font-bold mr-4">Visit us or call us today:</h2>
          <div className="border-b-2 border-blue-500 flex-grow"></div>
          <a href="https://www.facebook.com/example" target="_blank" rel="noopener noreferrer" className="text-blue-500">
            <FaFacebook className="text-4xl hover:text-blue-600 cursor-pointer" />
          </a>
          <a href="https://www.instagram.com/example" target="_blank" rel="noopener noreferrer" className="text-pink-500">
            <FaInstagram className="text-4xl hover:text-pink-600 cursor-pointer" />
          </a>
          <a href="tel:+918935016229" className="text-green-500">
            <FaPhoneSquareAlt className="text-4xl hover:text-green-600 cursor-pointer" />
          </a>
        </div>
        <div>
          <hr className="border-blue-800 w-full" />
        </div>

        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="flex flex-col lg:flex-row items-start lg:space-x-8 p-4 max-w-6xl mx-auto">
            <div className="w-full lg:w-1/2 p-4 bg-white shadow-md rounded mb-8 lg:mb-0">
              <h2 className="text-2xl font-bold mb-4">Opening Hours</h2>
              <p className="mb-4">Monday to Wednesday: 9:00 AM - 11:00 PM</p>
              <p className="mb-4">Thursday to Friday: 3:00 AM - 11:00 PM</p>
              <p className="mb-4">Friday: 9:00 AM - 11:00 PM</p>
              <p className="mb-4">Saturday and Sunday: Closed</p>
            </div>

            <form onSubmit={handleSubmit} className="w-full lg:w-1/2 p-4 bg-gradient-to-r from-blue-300 to-blue-700 text-white shadow-lg rounded">
              <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
              <div className="mb-4">
                <label className="block text-white">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded bg-white text-gray-900 shadow-md"
                />
                {errors.name && <p className="text-red-500">{errors.name}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-white">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded bg-white text-gray-900 shadow-md"
                />
                {errors.email && <p className="text-red-500">{errors.email}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-white">Favorite Food</label>
                <input
                  type="text"
                  name="food"
                  value={formData.food}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded bg-white text-gray-900 shadow-md"
                />
                {errors.food && <p className="text-red-500">{errors.food}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-white">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded bg-white text-gray-900 shadow-md"
                ></textarea>
                {errors.message && <p className="text-red-500">{errors.message}</p>}
              </div>
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded shadow-md hover:bg-green-600 transition-colors w-full">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactForm;

