import React from 'react';

function EditPostForm({ editingPost, handleEditChange, handleEditSubmit, cancelEdit }) {
  return (
    <div className="mt-6 bg-gray-100 p-4 rounded">
      <h3 className="text-lg font-bold mb-4">Edit Post</h3>
      <input
        type="text"
        value={editingPost.title}
        onChange={(e) => handleEditChange('title', e.target.value)}
        className="border border-gray-300 rounded px-4 py-2 w-full mb-2"
      />
      <textarea
        value={editingPost.content}
        onChange={(e) => handleEditChange('content', e.target.value)}
        className="border border-gray-300 rounded px-4 py-2 w-full mb-2"
      />
      <button
        onClick={handleEditSubmit}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Save Changes
      </button>
      <button
        onClick={cancelEdit}
        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded ml-2"
      >
        Cancel
      </button>
    </div>
  );
}

export default EditPostForm;