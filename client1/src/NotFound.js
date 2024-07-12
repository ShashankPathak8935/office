import React from 'react';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-400 to-purple-600">
      <div className="text-center p-8 bg-white rounded-lg shadow-2xl">
        <h1 className="text-6xl font-extrabold text-red-500 mb-6">
          404 - Page Not Found 😢
        </h1>
        <p className="text-lg text-gray-600">
          Please check the URL or return to the home page.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
