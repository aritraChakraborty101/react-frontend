import React from 'react';
import { Link } from 'react-router-dom';
import './CssComponent/Navbar.css'; // Import the CSS file for styling

function Navbar({ role, logoutFn }) {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/user_info">User Info</Link>
        </li>
        <li>
          <Link to="/orgs">Organizations</Link>
        </li>
        {role && (role === 'Moderator' || role === 'Admin') && (
          <>
            <li>
              <Link to="/manage_users">Manage Users</Link>
            </li>
            <li>
              <Link to="/manage_role_requests">Manage Role Requests</Link>
            </li>
          </>
        )}
        <li>
          <Link to="/request_role">Request Role</Link>
        </li>
        <li>
          <Link to="/users">All Users</Link>
        </li>
        <li>
          <button onClick={() => logoutFn(true)}>Log Out</button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;