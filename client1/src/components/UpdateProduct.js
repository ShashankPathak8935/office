import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import Dashboard from './Dashboard';
import NavbarAdmin from './NavbarAdmin';

const Notification = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
      <span>{message}</span>
      <button className="ml-2 text-white" onClick={onClose}>x</button>
    </div>
  );
};

const UpdateProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(location.state?.product || {
    id: '',
    name: '',
    price: '',
    description: '',
    category: '',
    photo: '',
    discount: ''
  });
  const [image, setImage] = useState(null);
  const [notification, setNotification] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!location.state?.product) {
      const fetchProduct = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/products/${productId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          setProduct(response.data);
        } catch (err) {
          console.error('Error fetching product:', err);
        }
      };
      fetchProduct();
    }
  }, [productId, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prevProduct => ({
      ...prevProduct,
      [name]: value
    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: ''
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!product.name) newErrors.name = 'Name is required';
    if (!product.price) newErrors.price = 'Price is required';
    if (!product.description) newErrors.description = 'Description is required';
    if (!product.category) newErrors.category = 'Category is required';
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
    formData.append('name', product.name);
    formData.append('price', product.price);
    formData.append('description', product.description);
    formData.append('category', product.category);
    formData.append('discount', product.discount);
    if (image) {
      formData.append('photo', image);
    }

    try {
      await axios.put(`http://localhost:5000/products/${productId}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setNotification('Product updated successfully');
      setTimeout(() => {
        setNotification('');
        navigate('/products');
      }, 3000); // Notification will disappear after 3 seconds
    } catch (err) {
      console.error('Error updating product:', err);
    }
  };

  return (
    <>
      <Dashboard />
      <NavbarAdmin />
      <div className="container mx-auto mt-8 p-4">
        <Notification message={notification} onClose={() => setNotification('')} />
        <h2 className="text-2xl font-bold mb-6 text-center">Update Product</h2>
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-8 rounded shadow-md">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={product.name}
              onChange={handleChange}
              className={`border border-gray-300 rounded-md p-2 w-full ${errors.name ? 'border-red-500' : ''}`}
              placeholder="Enter product name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price:</label>
            <input
              type="number"
              id="price"
              name="price"
              value={product.price}
              onChange={handleChange}
              className={`border border-gray-300 rounded-md p-2 w-full ${errors.price ? 'border-red-500' : ''}`}
              placeholder="Enter product price"
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description:</label>
            <textarea
              id="description"
              name="description"
              value={product.description}
              onChange={handleChange}
              className={`border border-gray-300 rounded-md p-2 w-full ${errors.description ? 'border-red-500' : ''}`}
              placeholder="Enter product description"
            ></textarea>
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category:</label>
            <input
              type="text"
              id="category"
              name="category"
              value={product.category}
              onChange={handleChange}
              className={`border border-gray-300 rounded-md p-2 w-full ${errors.category ? 'border-red-500' : ''}`}
              placeholder="Enter product category"
            />
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="discount" className="block text-sm font-medium text-gray-700">Discount:</label>
            <input
              type="number"
              id="discount"
              name="discount"
              value={product.discount}
              onChange={handleChange}
              className="border border-gray-300 rounded-md p-2 w-full"
              placeholder="Enter product discount"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Photo:</label>
            <input
              type="file"
              id="photo"
              name="photo"
              onChange={handleImageChange}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors w-full"
          >
            Update
          </button>
        </form>
      </div>
    </>
  );
};

export default UpdateProduct;
