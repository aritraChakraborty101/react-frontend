import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ManageUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleBan = async (userId) => {
    try {
      const response = await axios.patch(`http://localhost:3001/users/${userId}/ban`);
      alert(response.data.message);
      setUsers(users.map((user) => (user.id === userId ? { ...user, is_banned: true } : user)));
    } catch (error) {
      console.error('Error banning user:', error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      const response = await axios.delete(`http://localhost:3001/users/${userId}`);
      alert(response.data.message);
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