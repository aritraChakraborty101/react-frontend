import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthInfo } from '@propelauth/react'; // Import useAuthInfo

function ReportUser() {
  const { userId } = useParams(); // Reported user's ID
  const [issue, setIssue] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { user, accessToken } = useAuthInfo(); // Retrieve user and access token

  const reporterId = user?.userId; // Safely access userId from the user object

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reporterId) {
      setMessage('Unable to retrieve reporter ID. Please log in again.');
      return;
    }
    try {
      await axios.post(
        'http://localhost:3001/users/report_user',
        {
          reported_user_id: userId,
          reporter_user_id: reporterId,
          issue,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Use the access token from useAuthInfo
          },
        }
      );
      setMessage('Report submitted successfully!');
      setTimeout(() => navigate('/'), 2000); // Redirect after 2 seconds
    } catch (error) {
      console.error('Error submitting report:', error);
      setMessage(error.response?.data?.error || 'Failed to submit report.');
    }
  };

  return (
    <div>
      <h2>Report User</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Describe the issue:
          <textarea
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            required
          />
        </label>
        <button type="submit">Submit Report</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default ReportUser;