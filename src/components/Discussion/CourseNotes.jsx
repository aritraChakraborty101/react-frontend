import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuthInfo } from '@propelauth/react';
import axios from 'axios';

function CourseNotes() {
  const { courseId } = useParams(); // Get the course ID from the URL
  const { accessToken } = useAuthInfo(); // Get the access token
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState('');
  const [courseName, setCourseName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/notes/${courseId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setNotes(response.data);
        if (response.data.length > 0) {
          setCourseName(response.data[0].course_name || 'Course Notes');
        }
      } catch (err) {
        console.error('Error fetching notes:', err);
        setError('Failed to load notes.');
      }
    };

    fetchNotes();
  }, [courseId, accessToken]);

  if (error) {
    return <p className="text-red-500 text-center mt-4">{error}</p>;
  }

  if (!notes.length) {
    return <p className="text-gray-400 text-center mt-4">No notes available for this course.</p>;
  }

  const handleNoteClick = (noteId) => {
    navigate(`/courses/${courseId}/notes/${noteId}`); // Navigate to the specific note page
  };

  return (
    <div className="container mx-auto px-4 py-6 bg-gray-900 text-gray-200">
      <h2 className="text-2xl font-bold text-center mb-6">{courseName}</h2>
      <ul className="space-y-4 max-w-2xl mx-auto">
        {notes.map((note) => (
          <li
            key={note.id}
            className="bg-gray-800 shadow-md rounded-lg p-4 hover:bg-gray-700 transition cursor-pointer"
            onClick={() => handleNoteClick(note.id)}
          >
            <p className="text-gray-400 text-sm">
              <Link
                to={`/profile/${note.user_id}`}
                className="font-semibold text-gray-200 hover:text-blue-400 transition"
                onClick={(e) => e.stopPropagation()} // Prevent navigation conflict
              >
                {note.author}
              </Link>
              {' '}• {new Date(note.created_at).toLocaleString()}
            </p>
            <h3 className="text-lg font-bold mt-2 text-gray-200">{note.title}</h3>
            <p className="text-gray-300 mt-2">{note.tags?.join(', ')}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CourseNotes;