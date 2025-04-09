import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
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
    return <p>{error}</p>;
  }

  if (!profile) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Public Profile</h2>
      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Contributions:</strong> {profile.contributions}</p>
      <button onClick={handleReportUser}>Report User</button>
    </div>
  );
}

export default PublicProfile;