import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthInfo } from '@propelauth/react';

function ManageRoleRequests() {
  const [roleRequests, setRoleRequests] = useState([]);
  const { accessToken } = useAuthInfo(); // Get the access token from PropelAuth

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:3001/users/role_requests', {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the access token in the Authorization header
          },
        });
        setRoleRequests(response.data);
      } catch (error) {
        console.error('Error fetching role requests:', error);
      }
    };

    if (accessToken) {
      fetchRequests();
    }
  }, [accessToken]);

  const handleUpdate = async (requestId, status) => {
    try {
      const response = await axios.patch(
        `http://localhost:3001/users/role_requests/${requestId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the access token in the Authorization header
          },
        }
      );
      alert(response.data.message);
      setRoleRequests(roleRequests.filter((req) => req.id !== requestId));
    } catch (error) {
      console.error('Error updating role request:', error);
      alert(error.response?.data?.error || 'An error occurred while updating the role request');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 bg-gray-900 text-gray-200">
      <h2 className="text-2xl font-bold text-center mb-6">Manage Role Requests</h2>
      <ul className="space-y-4">
        {roleRequests.map((req) => (
          <li
            key={req.id}
            className="bg-gray-800 shadow-md rounded-lg p-4 hover:bg-gray-700 transition"
          >
            <p className="text-gray-300">
              <strong className="text-gray-200">User ID:</strong> {req.user_id}
            </p>
            <p className="text-gray-300">
              <strong className="text-gray-200">Requested Role:</strong> {req.requested_role}
            </p>
            <p className="text-gray-300">
              <strong className="text-gray-200">Status:</strong> {req.status}
            </p>
            <div className="flex space-x-4 mt-4">
              <button
                onClick={() => handleUpdate(req.id, 'approved')}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
              >
                Approve
              </button>
              <button
                onClick={() => handleUpdate(req.id, 'rejected')}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
              >
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageRoleRequests;