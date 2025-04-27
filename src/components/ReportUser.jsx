import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthInfo } from '@propelauth/react'; // Import useAuthInfo
import { reportUser } from '../api/api'; // Import the API function

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
      await reportUser(accessToken, reporterId, userId, issue); // Use the API function
      setMessage('Report submitted successfully!');
      setTimeout(() => navigate('/'), 2000); // Redirect after 2 seconds
    } catch (error) {
      console.error('Error submitting report:', error);
      setMessage(error.response?.data?.error || 'Failed to submit report.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 bg-gray-900 text-gray-200">
      <div className="bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-200">Report User</h2>
        <form onSubmit={handleSubmit}>
          <label className="block text-gray-300 font-semibold mb-2">
            Describe the issue:
            <textarea
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              required
              className="w-full bg-gray-900 text-gray-200 border border-gray-700 rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow-md transition"
          >
            Submit Report
          </button>
        </form>
        {message && (
          <p className={`mt-4 text-center ${message.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default ReportUser;