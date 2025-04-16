import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthInfo } from '@propelauth/react';
import axios from 'axios';

function NoteViewer() {
  const { courseId, noteId } = useParams(); // Get the course and note IDs from the URL
  const { accessToken } = useAuthInfo(); // Get the access token
  const [note, setNote] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/notes/${courseId}/${noteId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setNote(response.data);
      } catch (err) {
        console.error('Error fetching note:', err);
        setError('Failed to load the note.');
      }
    };

    fetchNote();
  }, [courseId, noteId, accessToken]);

  if (error) {
    return <p className="text-red-500 text-center mt-4">{error}</p>;
  }

  if (!note) {
    return <p className="text-gray-400 text-center mt-4">Loading note...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-6 bg-gray-900 text-gray-200">
      <h2 className="text-2xl font-bold text-center mb-6">{note.title}</h2>
      <iframe
        src={note.file_url} // Use the Cloudinary URL directly
        title={note.title}
        className="w-full h-screen"
      ></iframe>
    </div>
  );
}

export default NoteViewer;