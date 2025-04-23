import React from "react";
import PaymentButton from "./PaymentButton"; // Ensure this path is correct

function PremiumAccessPage() {
  return (
    <div className="container mx-auto p-6 bg-gray-900 min-h-screen">
      <div className="bg-gray-800 shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4 text-white">Upgrade to Premium</h1>
        <p className="text-lg text-gray-300 mb-6">
          Unlock exclusive access to premium course notes, additional features, and an ad-free browsing experience.
          Become a premium member today and take your learning to the next level.
        </p>
        
        {/* Features Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-3">Premium Benefits</h2>
          <ul className="list-disc ml-6 text-gray-300">
            <li>Unlimited access to premium course notes</li>
            <li>Exclusive content only available to premium users</li>
            <li>Ad-free browsing experience</li>
            <li>Priority support from our team</li>
          </ul>
        </div>

        {/* Payment Button */}
        <PaymentButton />
      </div>
    </div>
  );
}

export default PremiumAccessPage;

