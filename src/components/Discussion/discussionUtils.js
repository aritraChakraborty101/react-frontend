import axios from 'axios';

/**
 * Fetch posts for a specific course.
 */
export const fetchPosts = async (courseId, accessToken) => {
  try {
    const response = await axios.get(`http://localhost:3001/courses/courses/${courseId}/posts`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (err) {
    console.error('Error fetching posts:', err);
    throw err;
  }
};

/**
 * Handle upvote or downvote for a post.
 */
export const handleVote = async (postId, voteType, userId, accessToken) => {
  try {
    const response = await axios.post(
      `http://localhost:3001/courses/posts/${postId}/vote`,
      {
        user_id: userId,
        vote_type: voteType,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.message;
  } catch (err) {
    console.error('Error voting on post:', err);
    throw err.response?.data?.error || 'Failed to vote on post.';
  }
};

/**
 * Submit a new post for a course.
 */
export const handlePostSubmit = async (courseId, newPost, userId, accessToken) => {
  try {
    const response = await axios.post(
      `http://localhost:3001/courses/courses/${courseId}/posts`,
      {
        ...newPost,
        user_id: userId,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.message;
  } catch (err) {
    console.error('Error creating post:', err);
    throw err.response?.data?.error || 'Failed to create post.';
  }
};

/**
 * Edit an existing post.
 */
export const handleEditPost = async (postId, updatedPost, userId, accessToken) => {
  try {
    const response = await axios.put(
      `http://localhost:3001/courses/posts/${postId}`,
      {
        user_id: userId,
        title: updatedPost.title,
        content: updatedPost.content,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.message;
  } catch (err) {
    console.error('Error editing post:', err);
    throw err.response?.data?.error || 'Failed to edit post.';
  }
};

// /**
//  * Delete a post.
//  */


export const deletePost = async (postId, userId, accessToken) => {
  try {
    const response = await axios.delete(
      `http://localhost:3001/courses/posts/${postId}`,
      {
        data: {
          user_id: userId, 
        },
        headers: {
          Authorization: `Bearer ${accessToken}`, 
        },
      }
    );
    return response.data.message; 
  } catch (err) {
    console.error('Error deleting post:', err);
    throw err.response?.data?.error || 'Failed to delete post.'; 
  }
};

export const fetchComments = async (postId, accessToken) => {
  try {
    const response = await axios.get(`http://localhost:3001/courses/posts/${postId}/comments`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (err) {
    console.error("Error fetching comments:", err);
    throw err.response?.data?.error || "Failed to fetch comments.";
  }
};

export const createComment = async (postId, userId, content, accessToken) => {
  try {
    const response = await axios.post(
      `http://localhost:3001/courses/posts/${postId}/comments`,
      { user_id: userId, content },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.message;
  } catch (err) {
    console.error("Error creating comment:", err);
    throw err.response?.data?.error || "Failed to create comment.";
  }
};

/**
 * Edit an existing comment.
 */

export const editComment = async (commentId, userId, content, accessToken) => {
  try {
    const response = await axios.put(
      `http://localhost:3001/courses/comments/${commentId}`,
      { user_id: userId, content },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.message;
  } catch (err) {
    console.error("Error editing comment:", err);
    throw err.response?.data?.error || "Failed to edit comment.";
  }
};

// /**
//  * Delete a comment.
//  */

export const deleteComment = async (commentId, userId, accessToken) => {
  try {
    const response = await axios.delete(
      `http://localhost:3001/courses/comments/${commentId}`,
      {
        data: { user_id: userId },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data.message;
  } catch (err) {
    console.error("Error deleting comment:", err);
    throw err.response?.data?.error || "Failed to delete comment.";
  }
};