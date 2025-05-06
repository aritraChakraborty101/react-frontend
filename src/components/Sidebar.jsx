import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="bg-gray-800 text-white w-64 h-screen fixed top-0 left-0 shadow-lg">
      <div className="p-4 text-xl font-bold border-b border-gray-700">
        Navigation
      </div>
      <ul className="space-y-4 p-4">
        <li>
          <Link to="/" className="block hover:bg-gray-700 px-4 py-2 rounded">
            Home
          </Link>
        </li>
        <li>
          <Link to="/user_info" className="block hover:bg-gray-700 px-4 py-2 rounded">
            User Info
          </Link>
        </li>
        <li>
          <Link to="/orgs" className="block hover:bg-gray-700 px-4 py-2 rounded">
            Organizations
          </Link>
        </li>
        <li>
          <Link to="/request_role" className="block hover:bg-gray-700 px-4 py-2 rounded">
            Request Role
          </Link>
        </li>
        <li>
          <Link to="/users" className="block hover:bg-gray-700 px-4 py-2 rounded">
            All Users
          </Link>
        </li>
        <li>
          <Link to="/add_course" className="block hover:bg-gray-700 px-4 py-2 rounded">
            Add Courses
          </Link>
        </li>
        <li>
          <Link to="/courses" className="block hover:bg-gray-700 px-4 py-2 rounded">
            Courses
          </Link>
        </li>
        <li>
          <Link to="/conversations" className="block hover:bg-gray-700 px-4 py-2 rounded">
            Chat List
          </Link>
          
        </li>
        <li>
        <Link to="/ai-helper" className="block hover:bg-gray-700 px-4 py-2 rounded">
            AI Helper
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;