import React, { useState } from 'react';
import { useAuthInfo } from '@propelauth/react'; // Import useAuthInfo to get the access token
import { requestRole } from '../api/api'; // Import the API function

function RequestRole() {
  const [requestedRole, setRequestedRole] = useState('');
  const { accessToken } = useAuthInfo(); // Get the access token from PropelAuth

  const handleRequest = async () => {
    try {
      const response = await requestRole(accessToken, requestedRole); // Use the API function
      alert(response.message);
    } catch (error) {
      console.error('Error requesting role:', error);
      alert(error.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 bg-gray-900 text-gray-200">
      <div className="bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-200">Request Role Upgrade</h2>
        <div className="mb-4">
          <label htmlFor="role" className="block text-gray-300 font-semibold mb-2">
            Select Role:
          </label>
          <select
            id="role"
            value={requestedRole}
            onChange={(e) => setRequestedRole(e.target.value)}
            className="w-full bg-gray-900 text-gray-200 border border-gray-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Role</option>
            <option value="Moderator">Moderator</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <button
          onClick={handleRequest}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow-md transition w-full"
        >
          Request Role
        </button>
      </div>
    </div>
  );
}

export default RequestRole;