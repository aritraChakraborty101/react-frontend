import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthInfo } from '@propelauth/react';

function PublicProfile() {
  const { userId } = useParams(); // Get the user ID from the URL
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const { user } = useAuthInfo(); // Get the current logged-in user's info
  const navigate = useNavigate();
  const [connectionStatus, setConnectionStatus] = useState('pending');
  const { accessToken } = useAuthInfo();

  const handleReportUser = () => {
    navigate(`/report/${userId}`);
  };

  const handleConnectionRequest = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3001/connections/request',
        { receiver_id: userId },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      console.log(response.data);
      setConnectionStatus('sent'); // Disable further requests once sent
    } catch (err) {
      console.error('Error sending connection request:', err);
      setError('Could not send connection request.');
    }
  };

  // Optionally, check if a connection request has already been sent.
  useEffect(() => {
    const fetchSentRequests = async () => {
      try {
        const res = await axios.get('http://localhost:3001/connections/sent', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        // Check if any request has already been sent to this user in a pending state.
        const existing = res.data.find(
          (req) => req.receiver_id === userId && req.status === 'pending'
        );
        if (existing) {
          setConnectionStatus('sent');
        }
      } catch (err) {
        console.error('Error fetching sent requests:', err);
      }
    };
    if (accessToken && user && userId) {
      fetchSentRequests();
    }
  }, [accessToken, user, userId]);
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/users/public_profile/${userId}`);
        setProfile(response.data);
      } catch (err) {
        console.error('Error fetching public profile:', err);
        setError('Failed to load profile.');
      }
    };

    fetchProfile();
  }, [userId]);

  if (error) {
    return <p className="text-red-500 text-center mt-4">{error}</p>;
  }

  if (!profile) {
    return <p className="text-gray-400 text-center mt-4">Loading...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-200">Public Profile</h2>
        <p className="text-gray-300 mb-2">
          <strong className="font-semibold text-gray-200">Name:</strong> {profile.name}
        </p>
        <p className="text-gray-300 mb-2">
          <strong className="font-semibold text-gray-200">Email:</strong> {profile.email}
        </p>
        <p className="text-gray-300 mb-4">
          <strong className="font-semibold text-gray-200">Contributions:</strong> {profile.contributions}
        </p>
        <button
          onClick={handleReportUser}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow-md transition"
        >
          Report User
        </button>
        <button
          onClick={() => navigate(`/messages/${user.userId}/${userId}`)} // Pass both senderId and receiverId
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow-md transition"
        >
          Message
        </button>
        <button
            onClick={handleConnectionRequest}
            disabled={connectionStatus === 'sent'}
            className={`${
              connectionStatus === 'sent' ? 'bg-gray-500' : 'bg-green-500 hover:bg-green-600'
            } text-white px-4 py-2 rounded shadow-md transition`}
            aria-label="Send Connection Request"
          >
            {connectionStatus === 'sent' ? 'Request Sent' : 'Connect'}
          </button>
      </div>
    </div>
  );
}

export default PublicProfile;