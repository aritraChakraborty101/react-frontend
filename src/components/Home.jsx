import React from "react";
import { withRequiredAuthInfo } from "@propelauth/react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar"; // Adjust the path if necessary
import PaymentButton from "./PaymentButton"; // Stripe payment integration component

function Home(props) {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Premium Hero Section – placed at the top */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Upgrade to Premium</h1>
        <p className="max-w-xl mx-auto text-lg md:text-xl mb-6">
          Unlock unlimited access to premium course notes, exclusive content, and
          an ad-free browsing experience.
        </p>
        <PaymentButton />
      </div>

      {/* Main Content Section */}
      <div className="container mx-auto p-4">
        {/* Integrated Search Feature */}
        <div className="my-8">
          <SearchBar />
        </div>

        {/* Quick Links Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4 text-white">
            Quick Links
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/user_info"
              className="block p-4 bg-gray-800 border rounded hover:shadow-lg transition duration-200"
            >
              <div className="text-xl font-bold text-blue-400">User Info</div>
              <p className="text-gray-300">
                View your account information.
              </p>
            </Link>
            <Link
              to="/auth"
              className="block p-4 bg-gray-800 border rounded hover:shadow-lg transition duration-200"
            >
              <div className="text-xl font-bold text-blue-400">
                Authenticated Request
              </div>
              <p className="text-gray-300">
                Make secure API requests with authentication.
              </p>
            </Link>
            <Link
              to="/orgs"
              className="block p-4 bg-gray-800 border rounded hover:shadow-lg transition duration-200"
            >
              <div className="text-xl font-bold text-blue-400">Organizations</div>
              <p className="text-gray-300">
                Browse organization info and details.
              </p>
            </Link>
          </div>

          {/* Direct link to a dedicated premium benefits page */}
          <div className="mt-8 text-center">
            <Link
              to="/premium"
              className="inline-block px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded transition duration-200"
            >
              View Premium Benefits
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRequiredAuthInfo(Home);
