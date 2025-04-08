import React, { useState } from 'react';
import axios from 'axios';
import { useAuthInfo } from '@propelauth/react'; // Import useAuthInfo to get the access token

function RequestRole() {
  const [requestedRole, setRequestedRole] = useState('');
  const { accessToken } = useAuthInfo(); // Get the access token from PropelAuth

  const handleRequest = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3001/users/request_role',
        {
          requested_role: requestedRole,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the access token in the Authorization header
          },
        }
      );
      alert(response.data.message);
    } catch (error) {
      console.error('Error requesting role:', error);
      alert(error.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div>
      <h2>Request Role Upgrade</h2>
      <select value={requestedRole} onChange={(e) => setRequestedRole(e.target.value)}>
        <option value="">Select Role</option>
        <option value="Moderator">Moderator</option>
        <option value="Admin">Admin</option>
      </select>
      <button onClick={handleRequest}>Request Role</button>
    </div>
  );
}

export default RequestRole;