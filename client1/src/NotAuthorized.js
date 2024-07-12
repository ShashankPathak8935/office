import React from 'react';

const NotAuthorized = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-red-400 to-red-600">
      <div className="text-center p-8 bg-white rounded-lg shadow-2xl">
        <h1 className="text-6xl font-extrabold text-red-700 mb-6">
          Sorry 😞
        </h1>
        <p className="text-xl text-gray-800 mb-4">
          You are not able to access this page
        </p>
        <p className="text-lg text-gray-600">
          contact to Admin for further...
        </p>
      </div>
    </div>
  );
};

export default NotAuthorized;
