import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ role, logoutFn }) {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-lg font-bold">
          <Link to="/">Share Notes</Link>
        </div>
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="hover:text-gray-300">
              Home
            </Link>
          </li>
          <li>
            <Link to="/user_info" className="hover:text-gray-300">
              User Info
            </Link>
          </li>
          <li>
            <Link to="/orgs" className="hover:text-gray-300">
              Organizations
            </Link>
          </li>
          {role && (role === 'Moderator' || role === 'Admin') && (
            <>
              <li>
                <Link to="/manage_users" className="hover:text-gray-300">
                  Manage Users
                </Link>
              </li>
              <li>
                <Link to="/manage_role_requests" className="hover:text-gray-300">
                  Manage Role Requests
                </Link>
              </li>
              <li>
                <Link to="/reports" className="hover:text-gray-300">
                  Reports
                </Link>
              </li>
            </>
          )}
          <li>
            <Link to="/request_role" className="hover:text-gray-300">
              Request Role
            </Link>
          </li>
          <li>
            <Link to="/users" className="hover:text-gray-300">
              All Users
            </Link>
          </li>
          <li>
            <button
              onClick={() => logoutFn(true)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Log Out
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;