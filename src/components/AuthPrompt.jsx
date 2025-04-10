import React from 'react';

function AuthPrompt({ redirectToSignupPage, redirectToLoginPage }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <p className="text-gray-700 text-lg mb-4">To get started, please log in or sign up.</p>
        <div className="space-x-4">
          <button
            onClick={redirectToSignupPage}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow-md transition"
          >
            Sign up
          </button>
          <button
            onClick={redirectToLoginPage}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded shadow-md transition"
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthPrompt;