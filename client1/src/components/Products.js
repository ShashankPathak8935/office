import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import StarRating from './StarRating'; // Import StarRating component
import headerImage from '../images/contactus1.avif'; 

const Notification = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed top-0 left-0 w-full bg-green-500 text-white text-center py-2 z-50">
      {message}
    </div>
  );
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [notification, setNotification] = useState(''); // State for notification message
  const username = localStorage.getItem('username');
  const userId = localStorage.getItem('userId');
  const [averageRatings, setAverageRatings] = useState({}); // State for average ratings
  const [isLoadingRatings, setIsLoadingRatings] = useState(true); // Loading state for ratings

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/products');
        setProducts(response.data);
        setFilteredProducts(response.data); // Display all products by default
        fetchAverageRatings(response.data); // Fetch average ratings for products
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []); // Fetch products once on component mount

  const fetchAverageRatings = async (products) => {
    try {
      const promises = products.map(async (product) => {
        const response = await axios.get(`http://localhost:5000/product-rating/${product.id}`);
        return {
          productId: product.id,
          averageRating: response.data.average_rating,
          ratingCount: response.data.rating_count,
        };
      });

      const results = await Promise.all(promises);
      const averageRatingsMap = results.reduce((acc, curr) => {
        acc[curr.productId] = {
          averageRating: curr.averageRating,
          ratingCount: curr.ratingCount,
        };
        return acc;
      }, {});

      setAverageRatings(averageRatingsMap);
      setIsLoadingRatings(false);
    } catch (error) {
      console.error('Error fetching average ratings:', error);
      setIsLoadingRatings(false);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const response = await axios.post('http://localhost:5000/add-to-cart', {
        userId,
        productId
      });
      console.log('Product added to cart:', response.data);
      setCartCount(prevCount => prevCount + 1); // Increment cart count
      setNotification('Item added to cart successfully!');
      setTimeout(() => setNotification(''), 3000); // Clear notification after 3 seconds
    } catch (err) {
      console.error('Error adding product to cart:', err);
    }
  };

  return (
    <>
      <Notification message={notification} />
      <Navbar setFilteredProducts={setFilteredProducts} cartCount={cartCount} setCartCount={setCartCount} />
      <div className="relative h-64 md:h-96 w-full overflow-hidden">
        <img src={headerImage} alt="Header" className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col items-center bg-gray-100 py-8 min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out">
              <div className="relative">
                <img
                  src={`http://localhost:5000/uploads/${product.photo}`}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 text-xs rounded-full">
                  {product.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-900 font-bold text-xl">${product.price}</span>
                  {isLoadingRatings ? (
                    <p>Loading...</p>
                  ) : (
                    <div className="flex items-center">
                      <StarRating
                        rating={averageRatings[product.id] ? averageRatings[product.id].averageRating : 0}
                        disabled
                      />
                      {/* <span className="ml-2 text-sm text-gray-500">
                        ({averageRatings[product.id] ? averageRatings[product.id].averageRating.toFixed(1) : 0} avg)
                      </span> */}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleAddToCart(product.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition-colors w-full"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Products;

