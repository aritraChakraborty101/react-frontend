import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function PublicProfile() {
  const { userId } = useParams(); // Get the user ID from the URL
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleReportUser = () => {
    navigate(`/report/${userId}`);
  };

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
    return <p className="text-gray-500 text-center mt-4">Loading...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Public Profile</h2>
        <p className="text-gray-700 mb-2">
          <strong className="font-semibold">Name:</strong> {profile.name}
        </p>
        <p className="text-gray-700 mb-2">
          <strong className="font-semibold">Email:</strong> {profile.email}
        </p>
        <p className="text-gray-700 mb-4">
          <strong className="font-semibold">Contributions:</strong> {profile.contributions}
        </p>
        <button
          onClick={handleReportUser}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow-md transition"
        >
          Report User
        </button>
      </div>
    </div>
  );
}

export default PublicProfile;