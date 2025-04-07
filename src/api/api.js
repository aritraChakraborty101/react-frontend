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

export default api;