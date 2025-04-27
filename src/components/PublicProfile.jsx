import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthInfo } from '@propelauth/react';
import {
  fetchPublicProfile,
  sendConnectionRequest,
  fetchSentConnectionRequests,
} from '../api/api'; // Import the API functions

function PublicProfile() {
  const { userId } = useParams(); // Get the user ID from the URL
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const { user, accessToken } = useAuthInfo(); // Get the current logged-in user's info
  const navigate = useNavigate();
  const [connectionStatus, setConnectionStatus] = useState('pending');

  const handleReportUser = () => {
    navigate(`/report/${userId}`);
  };

  const handleConnectionRequest = async () => {
    try {
      const data = await sendConnectionRequest(accessToken, userId); // Use the API function
      console.log(data);
      setConnectionStatus('sent'); // Disable further requests once sent
    } catch (err) {
      console.error('Error sending connection request:', err);
      setError('Could not send connection request.');
    }
  };

  useEffect(() => {
    const fetchSentRequests = async () => {
      try {
        const requests = await fetchSentConnectionRequests(accessToken); // Use the API function
        const existing = requests.find(
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
        const data = await fetchPublicProfile(userId); // Use the API function
        setProfile(data);
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
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow-md transition mr-5"
        >
          Report User
        </button>
        <button
          onClick={() => navigate(`/messages/${user.userId}/${userId}`)} // Pass both senderId and receiverId
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow-md transition mr-5"
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