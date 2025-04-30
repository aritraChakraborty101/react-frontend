import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllUsers } from '../api/api'; // Import the API function

function UserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await fetchAllUsers(); // Use the API function
        setUsers(data);
        console.log('Fetched users:', data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users.');
      }
    };

    fetchUsers();
  }, []);

  if (error) {
    return <p className="text-red-400 text-center mt-4">{error}</p>;
  }

  if (!users.length) {
    return <p className="text-gray-400 text-center mt-4">Loading...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-200">All Users</h2>
      <ul className="space-y-4">
        {users.map((user) => (
          <li
            key={user.prope_user_id}
            className="bg-gray-800 shadow-md rounded-lg p-4 hover:bg-gray-700 transition"
          >
            <Link
              to={`/profile/${user.propel_user_id}`}
              className="text-blue-400 font-semibold hover:underline"
            >
              {user.name}
            </Link>
            <p className="text-gray-400">{user.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;