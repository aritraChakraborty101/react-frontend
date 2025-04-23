import React from "react";

function CancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Payment Canceled</h1>
        <p className="text-lg mb-6">
          It seems the payment process was interrupted. You can try again or explore other options.
        </p>
        <div className="flex justify-center space-x-4">
          <a
            href="/premium"
            className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded transition duration-200"
          >
            Try Again
          </a>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-gray-700 hover:bg-gray-800 text-white font-semibold rounded transition duration-200"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

export default CancelPage;
