import React, { useState } from 'react';
import { withAuthInfo } from '@propelauth/react';
import axios from 'axios';

function UserInfo({ user, accessToken }) {
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  // Update name in your database and PropelAuth
  const handleNameUpdate = async (e) => {
    e.preventDefault();
    try {
      // Split the name into firstName and lastName
      const [firstName, ...lastNameParts] = name.split(' ');
      const lastName = lastNameParts.join(' ');
      console.log('user Id is', user.userId);

      // Update name in your database
      await axios.patch(
        'http://localhost:3001/users/update_name',
        { name },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Update name in PropelAuth
      await axios.put(
        `https://api.propelauth.com/api/backend/v1/user/${user.userId}`,
        { firstName, lastName },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setMessage('Name updated successfully!');
    } catch (error) {
      console.error('Error updating name:', error);
      setMessage('Failed to update name.');
    }
  };

  // Update password in PropelAuth
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage('New password and confirm password do not match.');
      return;
    }

    try {
      await axios.put(
        `https://api.propelauth.com/api/backend/v1/user/${user.userId}/password`,
        { password: newPassword, askUserToUpdatePasswordOnLogin: false },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setMessage('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
      setMessage('Failed to update password. Please check your current password.');
    }
  };

  return (
    <div>
      <h2>User Profile</h2>
      <p>Email: {user?.email}</p>

      <h3>Update Name</h3>
      <form onSubmit={handleNameUpdate}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <button type="submit">Update Name</button>
      </form>

      <h3>Update Password</h3>
      <form onSubmit={handlePasswordUpdate}>
        <label>
          Current Password:
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </label>
        <label>
          New Password:
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Confirm New Password:
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Update Password</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default withAuthInfo(UserInfo);