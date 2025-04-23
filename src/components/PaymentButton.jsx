import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

// Load your publishable key from an environment variable or fallback value.
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || "pk_test_51RGmYgCYvSjLuAaB2JvAF1DkFG9WhA8fIUbj265FN9Lx6aDsqoFmaPf8CSmtpOVygzSkXP5pNpahaksbz9q4rv6g00PTgdbVuX");

function PaymentButton() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      // 1. Create a Checkout Session on your Flask backend—with authentication.
      const response = await fetch("http://localhost:3001/payment/create-checkout-session", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": "Bearer mysecrettoken"  // Ensure this matches your backend expected token
        },
        body: JSON.stringify({
          items: [{ price: "price_123", quantity: 1 }]
        })
      });
      
      const data = await response.json();

      // 2. Initialize Stripe.js.
      const stripe = await stripePromise;
      // 3. Redirect to Stripe Checkout using the returned session ID.
      const { error } = await stripe.redirectToCheckout({
        sessionId: data.id   // The backend returns { id: session.id }
      });
      if (error) {
        console.error("Stripe redirect error:", error.message);
      }
    } catch (err) {
      console.error("Error during checkout:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
      disabled={loading}
    >
      {loading ? "Processing..." : "Buy Premium"}
    </button>
  );
}

export default PaymentButton;
