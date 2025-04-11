import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthInfo } from '@propelauth/react';
import { fetchPosts, handleVote, handlePostSubmit, handleEditPost } from './discussionUtils';
import EditPostForm from './EditPostForm';
import SubmitPostForm from './SubmitPostForm'; // Import the new component


function DiscussionThreads() {
  const { courseId } = useParams();
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null); // Track the post being edited
  const { user, accessToken } = useAuthInfo();

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const postsData = await fetchPosts(courseId, accessToken);
        setPosts(postsData);
      } catch (err) {
        console.error('Error loading posts:', err);
      }
    };

    loadPosts();
  }, [courseId, accessToken]);

  const handleVoteClick = async (postId, voteType) => {
    try {
      const message = await handleVote(postId, voteType, user.userId, accessToken);
      const updatedPosts = await fetchPosts(courseId, accessToken);
      setPosts(updatedPosts);
    } catch (err) {
      alert(err);
    }
  };

  const handlePostSubmitClick = async (newPost) => {
    if (!user || !user.userId) {
      alert('User is not logged in or user ID is missing.');
      return;
    }

    try {
      const message = await handlePostSubmit(courseId, newPost, user.userId, accessToken);
      alert(message);
      const updatedPosts = await fetchPosts(courseId, accessToken);
      setPosts(updatedPosts);
    } catch (err) {
      alert(err);
    }
  };

  const handleEditClick = (post) => {
    setEditingPost(post); // Set the post to be edited
  };

  const handleEditSubmit = async () => {
    if (!editingPost || !user || !user.userId) {
      alert('User is not logged in or user ID is missing.');
      return;
    }

    try {
      const message = await handleEditPost(editingPost.id, editingPost, user.userId, accessToken);
      alert(message);
      setEditingPost(null); // Clear the editing state
      const updatedPosts = await fetchPosts(courseId, accessToken);
      setPosts(updatedPosts);
    } catch (err) {
      alert(err);
    }
  };

  const handleEditChange = (field, value) => {
    setEditingPost({ ...editingPost, [field]: value });
  };

  const cancelEdit = () => {
    setEditingPost(null);
  };

  return (
    <div className="container mx-auto px-4 py-6 bg-gray-900 text-gray-200">
      <h2 className="text-2xl font-bold text-center mb-6">Discussion Threads</h2>

      {/* Submit Post Form */}
      <div className="max-w-2xl mx-auto">
        <SubmitPostForm onSubmit={handlePostSubmitClick} />
      </div>

      <ul className="space-y-4 max-w-2xl mx-auto">
        {posts
          .slice() // Create a shallow copy of the posts array to avoid mutating the original state
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Sort by created_at in descending order
          .map((post) => (
            <li key={post.id} className="bg-gray-800 shadow-md rounded-lg p-4 hover:bg-gray-700 transition">
              <p className="text-gray-400 text-sm">
                <span className="font-semibold text-gray-200">{post.author}</span> • {new Date(post.created_at).toLocaleString()}
              </p>
              <h3 className="text-lg font-bold mt-2 text-gray-200">{post.title}</h3>
              <p className="text-gray-300 mt-2">{post.content}</p>
              <div className="flex space-x-4 mt-4 items-center">
                <div
                  onClick={() => handleVoteClick(post.id, 'upvote')}
                  className="cursor-pointer"
                >
                  <svg 
                   xmlns="http://www.w3.org/2000/svg"
                   width="32" height="32" fill="currentColor"
                   class="bi bi-arrow-up-circle"
                   viewBox="0 0 16 16">
                 <path 
                  fill-rule="evenodd"
                  d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z"/>
                  </svg>
                  <p className="text-gray-400 text-sm text-center">{post.upvotes}</p>
                </div>
                <div
                  onClick={() => handleVoteClick(post.id, 'downvote')}
                  className="cursor-pointer"
                >
                  <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="32" height="32" fill="currentColor" 
                  class="bi bi-arrow-down-circle" 
                  viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z"/>
                  </svg>
                  <p className="text-gray-400 text-sm text-center">{post.downvotes}</p>
                </div>
                {post.user_id === user?.userId && (
                  <button
                    onClick={() => handleEditClick(post)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                  >
                    Edit
                  </button>
                )}
              </div>
            </li>
          ))}
      </ul>

      {editingPost && (
        <EditPostForm
          editingPost={editingPost}
          handleEditChange={handleEditChange}
          handleEditSubmit={handleEditSubmit}
          cancelEdit={cancelEdit}
        />
      )}
    </div>
  );
}

export default DiscussionThreads;