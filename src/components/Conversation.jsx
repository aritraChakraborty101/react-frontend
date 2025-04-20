import React, { useEffect, useState, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SocketContext } from '../Context/socket';

function Conversation() {
  const { convoId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const bottomRef = useRef();
  const socket = useContext(SocketContext);

  // Redirect back if no convoId
  useEffect(() => {
    if (!convoId) {
      navigate('/messages');
    }
  }, [convoId, navigate]);

  // Fetch history
  useEffect(() => {
    if (!convoId) return;

    (async () => {
      try {
        const { data } = await axios.get(
          `/api/messages/conversations/${convoId}/messages`,
          { withCredentials: true }
        );
        setMessages(data);
        setError('');
      } catch {
        setError('Failed to load messages.');
      }
    })();
  }, [convoId]);

  // Scroll down when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Join socket room & listen
  useEffect(() => {
    socket.emit('join_conversation', { convo_id: Number(convoId) });

    const handleNewMessage = (data) => {
      if (data.conversation_id === Number(convoId)) {
        setMessages((prev) => [...prev, data.message]);
      }
    };

    socket.on('new_message', handleNewMessage);
    return () => {
      socket.off('new_message', handleNewMessage);
      socket.emit('leave_conversation', { convo_id: Number(convoId) });
    };
  }, [convoId, socket]);

  // Send a new message
  const sendMessage = async () => {
    if (!body.trim()) {
      setError('Message cannot be empty.');
      return;
    }
    try {
      await axios.post(
        `/api/messages/conversations/${convoId}/messages`,
        { body },
        { withCredentials: true }
      );
      setBody('');
      setError('');
      // server + socket will push the message back
    } catch {
      setError('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 flex flex-col h-screen">
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((m) => (
          <div key={m.id} className="mb-2">
            <strong className="text-gray-200">{m.sender}:</strong>{' '}
            <span className="text-gray-300">{m.body}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex">
        <input
          type="text"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="flex-1 rounded-l px-4 py-2 bg-gray-700 text-gray-200"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Conversation;

