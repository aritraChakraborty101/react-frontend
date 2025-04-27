import React, { useEffect, useState } from 'react';
import { fetchUsers, banUser, deleteUser } from '../api/api'; // Import the new API functions

function ManageUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const data = await fetchUsers(); // Use the API function
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchAllUsers();
  }, []);

  const handleBan = async (userId) => {
    try {
      const response = await banUser(userId); // Use the API function
      alert(response.message);
      setUsers(users.map((user) => (user.id === userId ? { ...user, is_banned: true } : user)));
    } catch (error) {
      console.error('Error banning user:', error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      const response = await deleteUser(userId); // Use the API function
      alert(response.message);
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div>
      <h2>Manage Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} ({user.email}) - Role: {user.role} - Banned: {user.is_banned ? 'Yes' : 'No'}
            <button onClick={() => handleBan(user.id)}>Ban</button>
            <button onClick={() => handleDelete(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageUsers;