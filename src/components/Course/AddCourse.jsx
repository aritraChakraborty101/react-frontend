import React, { useState } from 'react';
import { useAuthInfo } from '@propelauth/react'; // Import useAuthInfo to get the auth token
import { addCourse } from '../../api/api'; // Import the API function

function AddCourse() {
  const [courseName, setCourseName] = useState('');
  const [message, setMessage] = useState('');
  const { accessToken } = useAuthInfo(); // Get the access token from PropelAuth

  const handleAddCourse = async () => {
    try {
      const response = await addCourse(accessToken, courseName); // Use the API function
      setMessage(response.message);
      setCourseName(''); // Clear the input field
    } catch (err) {
      console.error('Error adding course:', err);
      setMessage(err.response?.data?.error || 'Failed to add course.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 bg-gray-900 text-gray-200">
      <h2 className="text-2xl font-bold text-center mb-6">Add a New Course</h2>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Course Name"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          className="bg-gray-800 text-gray-200 border border-gray-700 rounded px-4 py-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAddCourse}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
        >
          Add Course
        </button>
      </div>
      {message && <p className="text-center text-green-500">{message}</p>}
    </div>
  );
}

export default AddCourse;