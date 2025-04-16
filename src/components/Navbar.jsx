import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ role, logoutFn }) {
  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-lg font-bold">
          <Link to="/" className="hover:text-gray-300">
            Share Notes
          </Link>
        </div>
        <ul className="flex space-x-4">
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