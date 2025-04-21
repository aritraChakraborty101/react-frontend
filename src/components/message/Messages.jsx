import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useAuthInfo } from '@propelauth/react';
import axios from 'axios';

const socket = io('http://localhost:3001'); // Connect to the backend

function Messages() {
  const { senderId, receiverId } = useParams(); // Extract sender_id and receiver_id from the URL
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { accessToken } = useAuthInfo(); // Get the current user's token

  console.log('sender_id:', senderId);
  console.log('receiver_id:', receiverId);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/messages/conversation`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            sender_id: senderId,
            receiver_id: receiverId,
          },
        });

        setMessages(response.data); // Set the past messages in state
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    };

    fetchMessages(); // Fetch past messages when the component loads

    // Standardize the room name by sorting senderId and receiverId alphabetically
    const room = `conversation_${[senderId, receiverId].sort().join('_')}`;
    console.log('Joining room:', room); // Debugging: Log the room being joined

    socket.emit('join', {
      sender_id: senderId,
      receiver_id: receiverId,
      room,
    });

    socket.on('receive_message', (message) => {
      console.log('Received message:', message); // Debugging: Log the received message
      setMessages((prevMessages) => [...prevMessages, message]); // Add new messages in real-time
    });

    return () => {
      socket.off('receive_message');
    };
  }, [senderId, receiverId, accessToken]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    // Standardize the room name by sorting senderId and receiverId alphabetically
    const room = `conversation_${[senderId, receiverId].sort().join('_')}`;
    console.log('Sending message to room:', room); // Debugging: Log the room being sent to

    socket.emit('send_message', {
      sender_id: senderId, // Include the sender's user_id
      receiver_id: receiverId, // Include the receiver's user_id
      content: newMessage,
      room,
    });

    setNewMessage(''); // Clear the input field
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-center mb-6">Conversation</h2>
      <div className="bg-gray-800 shadow-md rounded-lg p-6">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded ${
                msg.sender_id === senderId ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-200'
              }`}
            >
              {msg.content}
            </div>
          ))}
        </div>
        <div className="mt-4 flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow px-4 py-2 rounded bg-gray-900 text-gray-200"
          />
          <button
            onClick={handleSendMessage}
            className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Messages;