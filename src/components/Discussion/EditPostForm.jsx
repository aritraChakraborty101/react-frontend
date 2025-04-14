import React from 'react';

function EditPostForm({ editingPost, handleEditChange, handleEditSubmit, cancelEdit }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded shadow-lg w-full max-w-lg">
        <h3 className="text-lg font-bold mb-4 text-gray-200">Edit Post</h3>
        <input
          type="text"
          value={editingPost.title}
          onChange={(e) => handleEditChange('title', e.target.value)}
          className="border border-gray-600 rounded px-4 py-2 w-full mb-2 bg-gray-900 text-gray-200"
        />
        <textarea
          value={editingPost.content}
          onChange={(e) => handleEditChange('content', e.target.value)}
          className="border border-gray-600 rounded px-4 py-2 w-full mb-2 bg-gray-900 text-gray-200"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleEditSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
          <button
            onClick={cancelEdit}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditPostForm;