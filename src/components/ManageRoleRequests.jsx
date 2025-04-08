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
    <div>
      <h2>Manage Role Requests</h2>
      <ul>
        {roleRequests.map((req) => (
          <li key={req.id}>
            User ID: {req.user_id}, Requested Role: {req.requested_role}, Status: {req.status}
            <button onClick={() => handleUpdate(req.id, 'approved')}>Approve</button>
            <button onClick={() => handleUpdate(req.id, 'rejected')}>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageRoleRequests;