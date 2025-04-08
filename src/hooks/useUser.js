import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { syncUser } from '../api/api';

export const useUser = (accessToken) => {
  const [userInfo, setUserInfo] = useState({});
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Decode the access token to extract user info
  useEffect(() => {
    if (accessToken) {
      const decodedToken = jwtDecode(accessToken);
      setUserInfo({
        userId: decodedToken.user_id,
        email: decodedToken.email,
        name: `${decodedToken.first_name} ${decodedToken.last_name}`,
      });
    }
  }, [accessToken]);

  // Sync user with the backend
  useEffect(() => {
    const syncUserWithBackend = async () => {
      if (userInfo.userId && userInfo.email) {
        try {
          await syncUser(userInfo);
          console.log('User synced successfully');
        } catch (error) {
          console.error('Error syncing user:', error);
        }
      }
    };
    syncUserWithBackend();
  }, [userInfo]);

  // Fetch the user's role from the backend
  useEffect(() => {
    const fetchUserRole = async () => {
      if (accessToken) {
        try {
          const response = await axios.get('http://localhost:3001/users/get_role', {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          setRole(response.data.role);
          console.log('User Role:', response.data.role);
        } catch (error) {
          console.error('Error fetching user role:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchUserRole();
  }, [accessToken]);

  return { userInfo, role, loading };
};