import React from 'react';
import reactLogo from '../images/daslogo1.png';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userImage');
    window.location.href = '/login';
  };

  const handleImageClick = () => {
    navigate('/adminhome');
  };

  return (
    <div className="bg-gray-100 text-dark min-h-screen w-64 fixed top-0 left-0 overflow-y-auto">
      <div className="p-1">
        <img src={reactLogo} className="h-25 w-80[vh] cursor-pointer" alt="React logo"/>
      </div>

      <ul className="p-2">
        <li className="py-2 px-4 hover:bg-gray-300">
          <Link to="/adminhome" className="block">
            Home
          </Link>
        </li>
        <li className="py-2 px-4 hover:bg-gray-300">
          <Link to="/create-product" className="block">
            Add More Products
          </Link>
        </li>
        <li className="py-2 px-4 hover:bg-gray-300">
          <Link to="/Ourproducts" className="block">
            Our Products
          </Link>
        </li>
        <li className="py-2 px-4 hover:bg-gray-300">
          <Link to="/products" className="block">
            Update Product
          </Link>
        </li>
        <li className="py-2 px-4 hover:bg-gray-300">
          <Link to="/order-request" className="block">
            Order Request
          </Link>
        </li>
        <li className="py-2 px-4 hover:bg-gray-300">
          <Link to="/updateadmin-profile" className="block">
            Update Profile
          </Link>
        </li>
        <li className="py-2 px-4 hover:bg-gray-300">
          <Link to="/user-requests" className="block">
            New User Request
          </Link>
        </li>
        <li className="py-2 px-4 hover:bg-gray-300">
          <Link to="/download-pdf" className="block">
            Download Pdf
          </Link>
        </li>
        <li className="py-2 px-4 hover:bg-gray-300">
          <Link to="/user-message" className="block">
            User's Messages
          </Link>
        </li>
        <li className="py-2 px-4 hover:bg-gray-300">
          <div className="block cursor-pointer" onClick={handleLogout}>
            Logout
          </div>
        </li>
      </ul>
    </div>
  );
}

export default Dashboard;
