import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthInfo } from '@propelauth/react';
import { fetchConversations } from '../../api/api'; // Import the API function

function Conversations() {
  const [conversations, setConversations] = useState([]);
  const { accessToken, user } = useAuthInfo(); // Get user info from auth context
  const navigate = useNavigate();

  useEffect(() => {
    const getConversations = async () => {
      try {
        const data = await fetchConversations(accessToken, user.userId); // Use the API function
        setConversations(data); // Set conversations in state
        console.log('Conversations:', data);
      } catch (err) {
        console.error('Error fetching conversations:', err);
      }
    };

    if (accessToken && user?.userId) {
      getConversations();
    }
  }, [accessToken, user?.userId]);

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