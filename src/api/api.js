import axios from 'axios';

// Base URL for the Flask backend
const API_BASE_URL = 'http://localhost:3001';

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Sync user with the backend
export const syncUser = async (userInfo) => {
  const response = await api.post('/users/sync', userInfo, {
    headers: {
      'Content-Type': 'application/json', // Ensure the Content-Type is set
    },
  });
  return response.data;
};

// Fetch user info
export const getUserInfo = async (token) => {
  const response = await api.get('/users/info', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Request a role upgrade
export const requestRole = async (token, requestedRole) => {
  const response = await api.post('/users/request_role', { requested_role: requestedRole }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Fetch organization info
export const getOrgInfo = async (token, orgId) => {
  const response = await api.get(`/orgs/${orgId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Fetch all role requests
export const fetchRoleRequests = async (accessToken) => {
  const response = await api.get('/users/role_requests', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

// Update the status of a role request
export const updateRoleRequest = async (accessToken, requestId, status) => {
  const response = await api.patch(
    `/users/role_requests/${requestId}`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

export const fetchUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

// Ban a user
export const banUser = async (userId) => {
  const response = await api.patch(`/users/${userId}/ban`);
  return response.data;
};

// Delete a user
export const deleteUser = async (userId) => {
  const response = await api.delete(`/users/${userId}`);
  return response.data;
};

// Create a Stripe Checkout session
export const createCheckoutSession = async (token, items) => {
  const response = await api.post(
    '/payment/create-checkout-session',
    { items },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data; // The backend should return { id: session.id }
};

// Fetch a user's public profile
export const fetchPublicProfile = async (userId) => {
  const response = await api.get(`/users/public_profile/${userId}`);
  return response.data;
};

// Send a connection request
export const sendConnectionRequest = async (accessToken, receiverId) => {
  const response = await api.post(
    '/connections/request',
    { receiver_id: receiverId },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

// Fetch sent connection requests
export const fetchSentConnectionRequests = async (accessToken) => {
  const response = await api.get('/connections/sent', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

// Fetch all user reports
export const fetchReports = async (accessToken) => {
  const response = await api.get('/users/reports', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

// Resolve a user report (ban or reject)
export const resolveReport = async (accessToken, reportId, action) => {
  const response = await api.patch(
    `/users/resolve_report/${reportId}`,
    { action },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

// Report a user
export const reportUser = async (accessToken, reporterId, reportedUserId, issue) => {
  const response = await api.post(
    '/users/report_user',
    {
      reported_user_id: reportedUserId,
      reporter_user_id: reporterId,
      issue,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

// Perform a search query
export const performSearch = async (query) => {
  const response = await api.get('/search', {
    params: { query },
  });
  return response.data;
};

// Fetch all users
export const fetchAllUsers = async () => {
  const response = await api.get('/users/all_users');
  return response.data;
};

// Fetch all conversations for a user
export const fetchConversations = async (accessToken, userId) => {
  const response = await api.get('/messages/conversations', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      user_id: userId, // Send user_id as a query parameter
    },
  });
  return response.data.conversations; // Return the conversations
};

// Fetch messages in a conversation
export const fetchMessages = async (accessToken, senderId, receiverId) => {
  const response = await api.get('/messages/conversation', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      sender_id: senderId,
      receiver_id: receiverId,
    },
  });
  return response.data; // Return the messages
};

// Fetch all courses
export const fetchCourses = async (accessToken) => {
  const response = await api.get('/courses/courses', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

// Fetch notes for a course
export const fetchNotes = async (accessToken, courseId) => {
  const response = await api.get(`/notes/${courseId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};

// Fetch comments for a note
export const fetchComments = async (accessToken, noteId) => {
  const response = await api.get(`/notes/${noteId}/comments`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};

// Add a comment to a note
export const addComment = async (accessToken, noteId, userId, content) => {
  const response = await api.post(
    `/notes/${noteId}/comments`,
    { content, user_id: userId },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  return response.data;
};

// Delete a comment
export const deleteComment = async (accessToken, noteId, commentId) => {
  const response = await api.delete(`/notes/${noteId}/comments/${commentId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};

// Vote on a note
export const voteNote = async (accessToken, noteId, userId, voteType) => {
  const response = await api.post(
    `/notes/${noteId}/vote`,
    { vote_type: voteType, user_id: userId },
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  return response.data;
};

// Delete a note
export const deleteNote = async (accessToken, noteId) => {
  const response = await api.delete(`/notes/${noteId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};

// Fetch posts for a specific course
export const fetchPosts = async (courseId, accessToken) => {
  const response = await api.get(`/courses/courses/${courseId}/posts`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

// Handle upvote or downvote for a post
export const votePost = async (postId, voteType, userId, accessToken) => {
  const response = await api.post(
    `/courses/posts/${postId}/vote`,
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
};

// Submit a new post for a course
export const createPost = async (courseId, newPost, userId, accessToken) => {
  const response = await api.post(
    `/courses/courses/${courseId}/posts`,
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
};

// Edit an existing post
export const editPost = async (postId, updatedPost, userId, accessToken) => {
  const response = await api.put(
    `/courses/posts/${postId}`,
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
};

// Delete a post
export const deletePost = async (postId, userId, accessToken) => {
  const response = await api.delete(`/courses/posts/${postId}`, {
    data: {
      user_id: userId,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data.message;
};

// Fetch comments for a post
export const fetchPostComments = async (postId, accessToken) => {
  const response = await api.get(`/courses/posts/${postId}/comments`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

// Create a comment for a post
export const createPostComment = async (postId, userId, content, accessToken) => {
  const response = await api.post(
    `/courses/posts/${postId}/comments`,
    { user_id: userId, content },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data.message;
};

// Edit an existing comment
export const editPostComment = async (commentId, userId, content, accessToken) => {
  const response = await api.put(
    `/courses/comments/${commentId}`,
    { user_id: userId, content },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data.message;
};

// Delete a comment
export const deletePostComment = async (commentId, userId, accessToken) => {
  const response = await api.delete(`/courses/comments/${commentId}`, {
    data: { user_id: userId },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data.message;
};

// Fetch a specific note by courseId and noteId
export const fetchNote = async (accessToken, courseId, noteId) => {
  const response = await api.get(`/notes/${courseId}/${noteId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

// Upload a note
export const uploadNote = async (accessToken, formData) => {
  const response = await api.post('/notes/upload', formData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Fetch pending notes for review
export const fetchPendingNotes = async (accessToken) => {
  const response = await api.get('/notes/review', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

// Update the status of a pending note (approve or reject)
export const updateNoteStatus = async (accessToken, noteId, status) => {
  const response = await api.patch(
    `/notes/review/${noteId}`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

// Add a new course
export const addCourse = async (accessToken, courseName) => {
  const response = await api.post(
    '/courses/add_course',
    { name: courseName },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};
export default api;