import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function UserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/users/all_users');
        setUsers(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users.');
      }
    };

    fetchUsers();
  }, []);

  if (error) {
    return <p className="text-red-500 text-center mt-4">{error}</p>;
  }

  if (!users.length) {
    return <p className="text-gray-500 text-center mt-4">Loading...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-center mb-6">All Users</h2>
      <ul className="space-y-4">
        {users.map((user) => (
          <li
            key={user.prope_user_id}
            className="bg-white shadow-md rounded-lg p-4 hover:bg-gray-100 transition"
          >
            <Link
              to={`/profile/${user.prope_user_id}`}
              className="text-blue-600 font-semibold hover:underline"
            >
              {user.name}
            </Link>
            <p className="text-gray-600">{user.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;