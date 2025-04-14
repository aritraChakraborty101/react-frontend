import React, { useState, useEffect, use } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthInfo } from '@propelauth/react';
import { fetchPosts, handleVote, handlePostSubmit, handleEditPost, deletePost, fetchComments, createComment, editComment, deleteComment } from './discussionUtils';
import EditPostForm from './EditPostForm';
import SubmitPostForm from './SubmitPostForm'; 


function DiscussionThreads() {
  const { courseId } = useParams();
  const [courseName, setCourseName] = useState('');
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({});
  const [commentsVisible, setCommentsVisible] = useState({}); 
  const [editingComment, setEditingComment] = useState(null);
  const [editedCommentContent, setEditedCommentContent] = useState("");
  const { user, accessToken } = useAuthInfo();



  useEffect(() => {
    const loadPosts = async () => {
      try {
        const postsData = await fetchPosts(courseId, accessToken);
        setPosts(postsData);
        if (postsData.length > 0) {
          const courseName = postsData[0].course_name;
          setCourseName(courseName);
        }
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

  const handleDeleteClick = async (postId) => {
    if (!user || !user.userId) {
      alert('User is not logged in or user ID is missing.');
      return;
    }
  
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;
  
    try {
      const message = await deletePost(postId, user.userId, accessToken);
      alert(message);
      const updatedPosts = await fetchPosts(courseId, accessToken); // Refresh the posts
      setPosts(updatedPosts);
    } catch (err) {
      alert(err);
    }
  };

  // for comments
  const handleFetchComments = async (postId) => {
    try {
      // Toggle visibility
      setCommentsVisible((prev) => ({
        ...prev,
        [postId]: !prev[postId], // Toggle the visibility for the specific post
      }));
  
      // Fetch comments only if they are not already visible
      if (!commentsVisible[postId]) {
        const postComments = await fetchComments(postId, accessToken);
        setComments((prev) => ({ ...prev, [postId]: postComments }));
      }
    } catch (err) {
      alert(err);
    }
  };

  const handleCreateComment = async (postId) => {
    if (!newComment[postId]?.trim()) {
      alert("Comment cannot be empty.");
      return;
    }
  
    try {
      await createComment(postId, user.userId, newComment[postId], accessToken);
      setNewComment((prev) => ({ ...prev, [postId]: '' })); 
      handleFetchComments(postId); 
    } catch (err) {
      alert(err);
    }
  };

  const handleEditCommentClick = (comment) => {
    setEditingComment(comment.id);
    setEditedCommentContent(comment.content);
  };
  
  const handleEditCommentSubmit = async (commentId) => {
    if (!editedCommentContent.trim()) {
      alert("Comment cannot be empty.");
      return;
    }
  
    try {
      const message = await editComment(commentId, user.userId, editedCommentContent, accessToken);
      alert(message);
      setEditingComment(null);
      handleFetchComments(commentId); // Refresh comments
    } catch (err) {
      alert(err);
    }
  };
  
  const handleDeleteCommentClick = async (commentId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this comment?");
    if (!confirmDelete) return;
  
    try {
      const message = await deleteComment(commentId, user.userId, accessToken);
      alert(message);
      handleFetchComments(commentId); // Refresh comments
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 bg-gray-900 text-gray-200">
      <h2 className="text-2xl font-bold text-center mb-6">
        Discussion Threads for {courseName} 
        </h2>
      {/* Submit Post Form */}
      <div className="max-w-2xl mx-auto">
        <SubmitPostForm onSubmit={handlePostSubmitClick} />
      </div>

      <ul className="space-y-4 max-w-2xl mx-auto">
        {posts
          .slice()
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .map((post) => (
            <li key={post.id} className="bg-gray-800 shadow-md rounded-lg p-4 hover:bg-gray-700 transition">
              <p className="text-gray-400 text-sm">
                <Link
                  to={`/profile/${post.user_id}`}
                  className="font-semibold text-gray-200 hover:text-blue-400 transition"
                >
                  {post.author}
                </Link>
                {' '}• {new Date(post.created_at).toLocaleString()}
              </p>
              <h3 className="text-lg font-bold mt-2 text-gray-200">{post.title}</h3>
              <p className="text-gray-300 mt-2">{post.content}</p>
              

              <div className="mt-4">
                <button
                  onClick={() => handleFetchComments(post.id)}
                  className="text-blue-500 hover:underline"
                >
                  {commentsVisible[post.id] ? "Hide Comments" : "View Comments"}
                </button>
                {commentsVisible[post.id] && comments[post.id] && (
                  <ul className="mt-2 space-y-2">
                  {comments[post.id].map((comment) => (
                    <li key={comment.id} className="text-gray-400 text-sm">
                      <p className="font-semibold text-gray-200">
                        <Link
                          to={`/profile/${comment.user_id}`}
                          className="hover:text-blue-400 transition"
                        >
                          {comment.author}
                        </Link>
                        {' '}• {new Date(comment.created_at).toLocaleString()}
                      </p>
                      {editingComment === comment.id ? (
                        <div className="mt-2">
                          <input
                            type="text"
                            value={editedCommentContent}
                            onChange={(e) => setEditedCommentContent(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-900 text-gray-200 rounded"
                          />
                          <button
                            onClick={() => handleEditCommentSubmit(comment.id)}
                            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingComment(null)}
                            className="mt-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded ml-2"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <p className="text-gray-300">{comment.content}</p>
                      )}
                      {comment.user_id === user?.userId && (
                        <div className="flex space-x-2 mt-2">
                          <button
                            onClick={() => handleEditCommentClick(comment)}
                            className="text-blue-500 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCommentClick(comment.id)}
                            className="text-red-500 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul> 
                )}
                <div className="mt-2">
                  <input
                    type="text"
                    value={newComment[post.id] || ''} // Use the post ID as the key
                    onChange={(e) =>
                      setNewComment((prev) => ({ ...prev, [post.id]: e.target.value }))
                    }
                    placeholder="Write a comment..."
                    className="w-full px-4 py-2 bg-gray-900 text-gray-200 rounded"
                  />
                  <button
                    onClick={() => handleCreateComment(post.id)}
                    className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Add Comment
                  </button>
                </div>
              </div>
      
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
                  className="cursor-pointer pl-5"
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
                  <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditClick(post)}
                    className="nf nf-fa-edit text-3xl pb-5 pl-5"
                  >
                  </button>
                  <button
                    onClick={() => handleDeleteClick(post.id)}
                    className="nf nf-fa-trash text-3xl pb-5 pl-5"
                  >
                  </button>
                </div>
                  
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