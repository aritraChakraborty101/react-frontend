import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SocketContext } from '../Context/socket';

function ConversationList() {
  const [convos, setConvos] = useState([]);
  const [error, setError] = useState('');
  const socket = useContext(SocketContext);
  const navigate = useNavigate();

  // Load conversations from API
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          '/api/messages/conversations',
          { withCredentials: true }
        );
        setConvos(data);
        setError('');
      } catch (err) {
        console.error('Error loading conversations:', err);
        setError('Failed to load conversations.');
      }
    })();
  }, []);

  // Listen for new-message updates via socket
  useEffect(() => {
    const handleConversationUpdate = (data) => {
      setConvos((prev) =>
        prev.map((c) =>
          c.conversation_id === data.conversation_id
            ? { ...c, last_message: data.message.body }
            : c
        )
      );
    };

    socket.on('new_message', handleConversationUpdate);
    return () => {
      socket.off('new_message', handleConversationUpdate);
    };
  }, [socket]);

  if (error) {
    return <p className="text-red-500 text-center mt-4">{error}</p>;
  }
  if (!convos.length) {
    return <p className="text-gray-400 text-center mt-4">No conversations yet.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-200">Messages</h2>
      <ul className="space-y-4">
        {convos.map((c) => (
          <li
            key={c.conversation_id}
            className="bg-gray-800 p-4 rounded cursor-pointer hover:bg-gray-700"
            onClick={() => navigate(`/messages/${c.conversation_id}`)}
          >
            <div className="text-blue-400 hover:underline">{c.with_user}</div>
            <p className="text-gray-400 text-sm mt-1">{c.last_message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ConversationList;


