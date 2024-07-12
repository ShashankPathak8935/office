import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserMessages = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/getMessages'); // Replace with your endpoint
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">User Messages</h2>
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <div key={index} className="bg-gray-50 shadow-md rounded-lg overflow-hidden mb-6 p-6 hover:bg-gray-100 transition duration-300">
              <p className="text-lg text-gray-800"><strong>Name:</strong> {message.name}</p>
              <p className="text-lg text-gray-800"><strong>Email:</strong> {message.email}</p>
              <p className="text-lg text-gray-800"><strong>Food:</strong> {message.food}</p>
              <p className="text-lg text-gray-800"><strong>Message:</strong> {message.message}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No messages found.</p>
        )}
      </div>
    </div>
  );
};

export default UserMessages;
