import React from "react";

function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-lg mb-6">
          Congratulations! You’ve upgraded to premium and now have access to exclusive content and features.
        </p>
        <a
          href="/premium-content"
          className="inline-block px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded transition duration-200"
        >
          Go to Premium Content
        </a>
      </div>
    </div>
  );
}

export default SuccessPage;
