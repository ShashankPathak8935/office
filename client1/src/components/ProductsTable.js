import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from './NavbarAdmin';

const ProductsTable = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/products', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchProducts();
  }, []);

  const handleUpdate = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/products/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const product = response.data;
      navigate(`/update/${id}`, { state: { product } });
    } catch (err) {
      console.error('Error fetching product:', err);
    }
  };

  const handleDelete = async (id, imagePath) => {
    try {
      await axios.delete(`http://localhost:5000/products/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setProducts(products.filter(product => product.id !== id)); // Update state after deletion
      console.log('Product deleted successfully!');

      // Delete the image from the server
      if (imagePath) {
        await axios.delete(`http://localhost:5000/${imagePath}`);
        console.log('Product image deleted successfully!');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  return (
    <>
      <NavbarAdmin />
      <div className="container mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-4xl font-bold mb-8 text-blue-800 text-center">Update Your Products</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-red-200">
                <th className="py-3 px-6 border-b text-left text-gray-700">ID</th>
                <th className="py-3 px-6 border-b text-left text-gray-700">Name</th>
                <th className="py-3 px-6 border-b text-left text-gray-700">Price</th>
                <th className="py-3 px-6 border-b text-left text-gray-700">Description</th>
                <th className="py-3 px-6 border-b text-left text-gray-700">Category</th>
                <th className="py-3 px-6 border-b text-left text-gray-700">Photo</th>
                <th className="py-3 px-6 border-b text-left text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="bg-yellow-500 border-b hover:bg-red-400">
                  <td className="py-4 px-6">{product.id}</td>
                  <td className="py-4 px-6">{product.name}</td>
                  <td className="py-4 px-6">{product.price}</td>
                  <td className="py-4 px-6">{product.description}</td>
                  <td className="py-4 px-6">{product.category}</td>
                  <td className="py-4 px-6">
                    {product.photo ? (
                      <img
                        src={`http://localhost:5000/uploads/${product.photo}`}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                    ) : (
                      <span className="text-red-500">Image not found</span>
                    )}
                  </td>
                  <td className="py-4 px-6 flex justify-around">
                    <button
                      onClick={() => handleUpdate(product.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(product.id, product.photo)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ProductsTable;
