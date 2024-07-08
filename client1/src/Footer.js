import React from 'react';
import logo from './images/navbar1.png'; // Adjust the path as needed
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-red-800 text-white py-8 mt-4">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="Company Logo" className="h-16 w-32" /> {/* Adjust height as needed */}
          <p>&copy; {new Date().getFullYear()} Restaurant Food. All rights reserved.</p>
        </div>
        <div className="flex space-x-4">
          <a href="/about" className="hover:text-gray-400">About</a>
          <a href="/contact" className="hover:text-gray-400">Contact</a>
          <a href="/home" className="hover:text-gray-400">Privacy Policy</a>
          <a href="/home" className="hover:text-gray-400">Terms of Service</a>
        </div>
        <div className="flex space-x-4">
          <a href="https://www.facebook.com/example" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
            <FaFacebook className="text-2xl" />
          </a>
          <a href="https://www.instagram.com/example" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
            <FaInstagram className="text-2xl" />
          </a>
          <a href="https://twitter.com/example" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
            <FaTwitter className="text-2xl" />
          </a>
          <a href="https://www.linkedin.com/company/example" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400">
            <FaLinkedin className="text-2xl" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

