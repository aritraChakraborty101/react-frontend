import React, { useState } from 'react';

function SubmitPostForm({ onSubmit }) {
  const [newPost, setNewPost] = useState({ title: '', content: '' });

  const handleChange = (field, value) => {
    setNewPost({ ...newPost, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(newPost);
    setNewPost({ title: '', content: '' }); // Clear the form after submission
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-gray-800 p-4 rounded-lg shadow-md">
      <input
        type="text"
        placeholder="Post Title"
        value={newPost.title}
        onChange={(e) => handleChange('title', e.target.value)}
        className="bg-gray-900 text-gray-200 border border-gray-700 rounded px-4 py-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <textarea
        placeholder="Post Content"
        value={newPost.content}
        onChange={(e) => handleChange('content', e.target.value)}
        className="bg-gray-900 text-gray-200 border border-gray-700 rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-2 transition"
      >
        Submit Post
      </button>
    </form>
  );
}

export default SubmitPostForm;