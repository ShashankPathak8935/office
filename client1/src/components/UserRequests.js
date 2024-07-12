import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavbarAdmin from './NavbarAdmin';

const UserRequests = () => {
  const [pendingUsers, setPendingUsers] = useState([]);

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/pending-registrations', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setPendingUsers(response.data);
      } catch (err) {
        console.error('Error fetching pending users:', err);
      }
    };
    fetchPendingUsers();
  }, []);

  const handleApprove = async (userId) => {
    try {
      await axios.post('http://localhost:5000/approve-user', { userId }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setPendingUsers(pendingUsers.filter(user => user.id !== userId));
    } catch (err) {
      console.error('Error approving user:', err);
    }
  };

  const handleReject = async (userId) => {
    try {
      await axios.post('http://localhost:5000/reject-user', { userId }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setPendingUsers(pendingUsers.filter(user => user.id !== userId));
    } catch (err) {
      console.error('Error rejecting user:', err);
    }
  };

  return (
    <>
      <NavbarAdmin />
      <div className="flex flex-col items-center mt-8">
        <div className="overflow-x-auto w-full max-w-4xl">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-red-800 text-white">
              <tr>
                <th className="py-2 px-4">Username</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Full Name</th>
                <th className="py-2 px-4">Role</th>
                <th className="py-2 px-4">Image</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.map(user => (
                <tr key={user.id} className="border-b hover:bg-yellow-500 transition-colors">
                  <td className="py-2 px-4 text-center">{user.username}</td>
                  <td className="py-2 px-4 text-center">{user.email}</td>
                  <td className="py-2 px-4 text-center">{user.full_name}</td>
                  <td className="py-2 px-4 text-center">{user.role}</td>
                  <td className="py-2 px-4 text-center">
                    <div className="flex justify-center items-center">
                      <img src={`http://localhost:5000/${user.image}`} alt={user.username} className="h-10 w-10 rounded-full object-cover" />
                    </div>
                  </td>
                  <td className="py-2 px-4 text-center">
                    <button
                      onClick={() => handleApprove(user.id)}
                      className="bg-green-500 text-white py-1 px-3 rounded-full hover:bg-green-600 transition-colors mr-2"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(user.id)}
                      className="bg-red-500 text-white py-1 px-3 rounded-full hover:bg-red-600 transition-colors"
                    >
                      delete
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

export default UserRequests;

