import React, { useState, useEffect, useRef } from 'react';
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
  const chatContainerRef = useRef(null);

  console.log('messages:', messages[0]);


  // Fetch past messages
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

    fetchMessages();

    // Standardize the room name by sorting senderId and receiverId alphabetically
    const room = `conversation_${[senderId, receiverId].sort().join('_')}`;
    console.log('Joining room:', room);

    socket.emit('join', {
      sender_id: senderId,
      receiver_id: receiverId,
      room,
    });

    socket.on('receive_message', (message) => {
      console.log('Received message:', message);
      setMessages((prevMessages) => [...prevMessages, message]); // Add new messages in real-time
    });

    return () => {
      socket.off('receive_message');
    };
  }, [senderId, receiverId, accessToken]);

  // Scroll to the bottom of the chat when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const room = `conversation_${[senderId, receiverId].sort().join('_')}`;
    console.log('Sending message to room:', room);

    socket.emit('send_message', {
      sender_id: senderId, // Include the sender's user_id
      receiver_id: receiverId, // Include the receiver's user_id
      content: newMessage,
      room,
    });

    setNewMessage(''); // Clear the input field
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-gray-200">
      <div className="w-full max-w-2xl flex flex-col h-full bg-gray-800 rounded-lg shadow-lg">
        {/* Chat Header */}
        <div className="bg-gray-700 p-4 text-center font-bold text-xl rounded-t-lg">
          Chat with {messages[0]?.sender_name || 'User'}
        </div>

        {/* Chat Messages */}
        <div
          className="flex-grow overflow-y-auto p-4 space-y-2"
          ref={chatContainerRef}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender_id === senderId ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg shadow-md ${
                  msg.sender_id === senderId
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-200'
                }`}
              >
                <p className="font-semibold text-sm">
                  {msg.sender_id === senderId ? 'You' : msg.sender_name}
                </p>
                <p className="text-lg">{msg.content}</p>
                <p className="text-xs text-gray-400 text-right">
                  {new Date(msg.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="bg-gray-700 p-4 flex items-center rounded-b-lg">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow px-4 py-2 rounded bg-gray-900 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            className="ml-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow-md"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Messages;