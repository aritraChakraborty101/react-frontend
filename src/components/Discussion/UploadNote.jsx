import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthInfo } from '@propelauth/react';
import { uploadNote } from '../../api/api'; // Import the API function

function UploadNote() {
  const { courseId } = useParams(); // Get the course ID from the URL
  const { accessToken, user } = useAuthInfo(); // Get user info and access token
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState(''); // New state for category tags
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Please upload a PDF file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('content', content);
    formData.append('course_id', courseId);
    formData.append('user_id', user.userId); // Send the user ID
    formData.append('tags', tags); // Send category tags

    try {
      await uploadNote(accessToken, formData); // Use the API function
      alert('Note uploaded successfully!');
      navigate(`/courses/${courseId}`);
    } catch (err) {
      console.error('Error uploading note:', err);
      setError('Failed to upload note.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-200">Upload Note</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-200 mb-2">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 text-gray-200 rounded"
            aria-label="Title of the note"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block text-gray-200 mb-2">Description</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 text-gray-200 rounded"
            aria-label="Description of the note"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="tags" className="block text-gray-200 mb-2">Category Tags (comma-separated)</label>
          <input
            id="tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 text-gray-200 rounded"
            placeholder="e.g., Math, Physics, Chemistry"
            aria-label="Category tags for the note"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="file" className="block text-gray-200 mb-2">Upload PDF</label>
          <input
            id="file"
            type="file"
            onChange={handleFileChange}
            accept=".pdf"
            className="w-full px-4 py-2 bg-gray-900 text-gray-200 rounded"
            aria-label="Upload PDF file"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          aria-label="Submit the form to upload the note"
        >
          Upload
        </button>
      </form>
    </div>
  );
}

export default UploadNote;