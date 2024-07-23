import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
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

const CreateProductForm = () => {
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    photo: null,
    description: '',
    category: '',
    discount: ''
  });
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setNewProduct(prevState => ({
      ...prevState,
      photo: e.target.files[0]
    }));
  };

  const validate = () => {
    const newErrors = {};
    // Validate name
    if (!newProduct.name.trim()) newErrors.name = 'Product name is required';
    // Validate price
    if (!newProduct.price || isNaN(newProduct.price) || newProduct.price <= 0) newErrors.price = 'Valid price is required';
    // Validate photo
    if (!newProduct.photo) newErrors.photo = 'Product photo is required';
    // Validate description
    if (!newProduct.description.trim()) newErrors.description = 'Description is required';
    // Validate category
    if (!newProduct.category.trim()) newErrors.category = 'Category is required';

    // No validation for discount, so it is not added to newErrors

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('price', newProduct.price);
    formData.append('photo', newProduct.photo);
    formData.append('description', newProduct.description);
    formData.append('category', newProduct.category);
    formData.append('discount', newProduct.discount || ''); // Ensure discount is always sent as a string

    try {
      await axios.post('http://localhost:5000/create-product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setNotification('Product created successfully');
      setTimeout(() => {
        setNotification('');
        navigate('/adminhome');
      }, 3000); // Notification will disappear after 3 seconds
    } catch (err) {
      console.error('Error creating product:', err);
      setNotification('Failed to create product');
    }
  };

  return (
    <>
      <Dashboard />
      <NavbarAdmin />
      <Notification message={notification} onClose={() => setNotification('')} />
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500 p-4">
        <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-8 rounded shadow-md">
          <h2 className="block text-gray-800 text-2xl font-bold mb-6 text-center">Add More Products</h2>

          {/* Product Name */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Price */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={newProduct.price}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.price ? 'border-red-500' : ''}`}
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
          </div>

          {/* Photo */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="photo">
              Photo
            </label>
            <input
              type="file"
              name="photo"
              onChange={handleFileChange}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.photo ? 'border-red-500' : ''}`}
            />
            {errors.photo && <p className="text-red-500 text-xs mt-1">{errors.photo}</p>}
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              name="description"
              value={newProduct.description}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.description ? 'border-red-500' : ''}`}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={newProduct.category}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.category ? 'border-red-500' : ''}`}
              placeholder="Enter category"
            />
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>

          {/* Discount */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="discount">
              Discount
            </label>
            <input
              type="number"
              name="discount"
              value={newProduct.discount}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500`}
              placeholder="Enter discount"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors"
          >
            Create Product
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateProductForm;

