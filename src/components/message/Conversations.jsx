import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthInfo } from '@propelauth/react';

function Conversations() {
  const [conversations, setConversations] = useState([]);
  const { accessToken, user } = useAuthInfo(); // Get user info from auth context
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get('http://localhost:3001/messages/conversations', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            user_id: user.userId, // Send user_id as a query parameter
          },
        });

        setConversations(response.data.conversations); // Set conversations in state
        console.log('Conversations:', response.data.conversations);
      } catch (err) {
        console.error('Error fetching conversations:', err);
      }
    };

    fetchConversations();
  }, [accessToken, user.userId]);

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-center mb-6">Conversations</h2>
      <ul className="space-y-4">
        {Object.entries(conversations).map(([otherUserId, name]) => (
          <li
            key={otherUserId}
            className="bg-gray-800 shadow-md rounded-lg p-4 hover:bg-gray-700 cursor-pointer"
            onClick={() =>
              navigate(`/messages/${user.userId}/${otherUserId}`) // Use other_user_id to navigate
            }
          >
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Conversations;