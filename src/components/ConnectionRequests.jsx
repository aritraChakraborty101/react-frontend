import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthInfo } from '@propelauth/react';

function ConnectionRequests() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const { accessToken } = useAuthInfo();

  useEffect(() => {
    const fetchReceivedRequests = async () => {
      try {
        const response = await axios.get('http://localhost:3001/connections/received', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setRequests(response.data);
      } catch (err) {
        console.error('Error fetching connection requests:', err);
        setError('Failed to load connection requests.');
      }
    };
    if (accessToken) {
      fetchReceivedRequests();
    }
  }, [accessToken]);

  const handleResponse = async (request_id, action) => {
    try {
      await axios.post(
        'http://localhost:3001/connections/respond',
        { request_id, action },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setRequests(requests.filter(req => req.request_id !== request_id));
    } catch (err) {
      console.error(`Error ${action}ing request:`, err);
      setError('An error occurred.');
    }
  };

  if (error) {
    return <p className="text-red-500 text-center mt-4">{error}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-center mb-6">Connection Requests</h2>
      {requests.length === 0 ? (
        <p className="text-gray-300 text-center">No pending connection requests.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((req) => (
            <li key={req.request_id} className="bg-gray-800 rounded p-4 shadow-md flex justify-between items-center">
              <div>
                <p className="text-gray-200">
                  <strong>{req.requester_name}</strong> sent you a connection request.
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleResponse(req.request_id, 'accept')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleResponse(req.request_id, 'reject')}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ConnectionRequests;
