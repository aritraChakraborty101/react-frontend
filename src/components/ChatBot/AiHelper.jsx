import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- Security Check ---
const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("API Key not found. Please check your .env file.");
}

// --- Initialize the Gemini Client ---
const genAI = new GoogleGenerativeAI(apiKey);

function AiHelper() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]); // Store chat messages
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (event) => {
    setPrompt(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    // Add user message to chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'user', content: prompt },
    ]);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const textResponse = await result.response.text();

      // Add AI response to chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'ai', content: textResponse },
      ]);
    } catch (err) {
      console.error("API Call Error:", err);
      setError(err.message || "An error occurred while fetching the response.");
    } finally {
      setIsLoading(false);
      setPrompt(''); // Clear input field
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-gray-200">
      <div className="w-full max-w-3xl flex flex-col h-full bg-gray-800 rounded-lg shadow-lg">
        {/* Chat Header */}
        <div className="bg-gray-700 p-4 text-center font-bold text-xl rounded-t-lg">
          AI Chat Assistant
        </div>

        {/* Chat Messages */}
        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg shadow-md ${
                  msg.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-200'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="bg-gray-700 p-4 flex items-center rounded-b-lg">
          <textarea
            value={prompt}
            onChange={handleInputChange}
            placeholder="Type your message..."
            rows="1"
            className="flex-grow px-4 py-2 rounded bg-gray-900 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            disabled={isLoading}
          />
          <button
            onClick={handleSubmit}
            className={`ml-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow-md ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AiHelper;