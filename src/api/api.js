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


// Fetch notes for a course
export const fetchNotes = async (courseId) => {
  const response = await api.get(`/notes/${courseId}`);
  return response.data;
};

// Upload a new note
export const uploadNote = async (noteData) => {
  const response = await api.post('/notes/upload', noteData);
  return response.data;
};

// Vote on a note (helpful/unhelpful)
export const voteOnNote = async (noteId, vote) => {
  const response = await api.patch(`/notes/vote/${noteId}`, { vote });
  return response.data;
};

export default api;