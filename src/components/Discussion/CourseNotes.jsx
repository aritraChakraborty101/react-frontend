import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthInfo } from '@propelauth/react';
import axios from 'axios';

function CourseNotes() {
  const { courseId } = useParams();
  const { accessToken, user } = useAuthInfo();

  const [notes, setNotes] = useState([]);
  const [error, setError] = useState('');

  const [commentsByNote, setCommentsByNote] = useState({});
  const [newCommentText, setNewCommentText] = useState({});
  const [reportReason, setReportReason] = useState({});
  const [feedback, setFeedback] = useState({});

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/notes/${courseId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setNotes(response.data);
        response.data.forEach((note) => {
          fetchComments(note.id);
        });
      } catch (err) {
        console.error('Error fetching notes:', err);
        setError('Failed to load notes.');
      }
    };

    fetchNotes();
  }, [courseId, accessToken]);

  const fetchComments = async (noteId) => {
    try {
      const response = await axios.get(`http://localhost:3001/notes/${noteId}/comments`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setCommentsByNote((prev) => ({
        ...prev,
        [noteId]: response.data,
      }));
    } catch (err) {
      console.error(`Error fetching comments for note ${noteId}:`, err);
    }
  };

  const handleVote = async (noteId, voteType) => {
    try {
      const res = await axios.post(
        `http://localhost:3001/notes/${noteId}/vote`,
        {
          user_id: user.userId,
          vote_type: voteType,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setFeedback((prev) => ({
        ...prev,
        [noteId]: res.data.message,
      }));
    } catch (err) {
      console.error(`Error voting on note ${noteId}:`, err);
      setFeedback((prev) => ({
        ...prev,
        [noteId]: 'Error casting vote.',
      }));
    }
  };

  const handleCommentSubmit = async (noteId) => {
    const text = newCommentText[noteId]?.trim();
    if (!text) return;

    try {
      await axios.post(
        `http://localhost:3001/notes/${noteId}/comments`,
        {
          user_id: user.userId,
          content: text,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      setNewCommentText((prev) => ({
        ...prev,
        [noteId]: '',
      }));
      fetchComments(noteId);
    } catch (err) {
      console.error(`Error adding comment to note ${noteId}:`, err);
    }
  };

  const handleDeleteComment = async (noteId, commentId) => {
    try {
      await axios.delete(`http://localhost:3001/notes/${noteId}/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      fetchComments(noteId);
    } catch (err) {
      console.error(`Error deleting comment ${commentId}:`, err);
    }
  };

  const handleReportSubmit = async (noteId) => {
    const reason = reportReason[noteId]?.trim();
    if (!reason) return;

    try {
      await axios.post(
        `http://localhost:3001/notes/${noteId}/report`,
        {
          reporter_user_id: user.userId,
          reason,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setFeedback((prev) => ({
        ...prev,
        [noteId]: 'Reporting successful',
      }));
      setReportReason((prev) => ({
        ...prev,
        [noteId]: '',
      }));
    } catch (err) {
      console.error(`Error reporting note ${noteId}:`, err);
      setFeedback((prev) => ({
        ...prev,
        [noteId]: 'Error reporting note.',
      }));
    }
  };

  if (error) {
    return <p className="text-red-500 text-center mt-4">{error}</p>;
  }

  if (!notes.length) {
    return (
      <p className="text-gray-400 text-center mt-4">
        No notes available for this course.
      </p>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 bg-gray-900 text-gray-200">
      <h2 className="text-2xl font-bold text-center mb-6">Course Notes</h2>

      <ul className="space-y-4 max-w-2xl mx-auto">
        {notes.map((note) => (
          <li key={note.id} className="bg-gray-800 shadow-md rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">
              <Link
                to={`/profile/${note.user_id}`}
                className="font-semibold text-gray-200 hover:text-blue-400 transition"
                onClick={(e) => e.stopPropagation()}
              >
                {note.author}
              </Link>{' '}
              • {new Date(note.created_at).toLocaleString()}
            </p>
            <h3 className="text-lg font-bold text-gray-200">{note.title}</h3>
            <p className="text-gray-300 mt-1 mb-3">Tags: {note.tags?.join(', ')}</p>

            <div className="mb-3">
              <a
                href={note.file_url}
                download
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded inline-block"
              >
                Download Note
              </a>
            </div>

            <div className="flex space-x-4 items-center mb-3">
              <button
                onClick={() => handleVote(note.id, 'upvote')}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
              >
                Upvote
              </button>
              <button
                onClick={() => handleVote(note.id, 'downvote')}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Downvote
              </button>
              {feedback[note.id] && (
                <span className="ml-2 text-gray-300">{feedback[note.id]}</span>
              )}
            </div>

            <div className="mb-3">
              <h4 className="font-semibold mb-2">Comments</h4>
              {commentsByNote[note.id]?.length ? (
                <ul className="mb-2 space-y-2">
                  {commentsByNote[note.id].map((comment) => (
                    <li key={comment.id} className="bg-gray-700 p-2 rounded relative">
                      <p className="text-sm text-gray-300">
                        <strong>{comment.author}</strong> •{' '}
                        {new Date(comment.created_at).toLocaleString()}
                      </p>
                      <p className="text-gray-100">{comment.content}</p>

                      {user.userId === comment.user_id && (
                        <button
                          onClick={() => handleDeleteComment(note.id, comment.id)}
                          className="absolute top-2 right-2 text-sm text-red-400 hover:text-red-600"
                        >
                          Delete
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No comments yet.</p>
              )}

              <textarea
                className="w-full p-2 bg-gray-800 text-gray-100 rounded mb-2"
                rows="2"
                placeholder="Write a comment..."
                value={newCommentText[note.id] || ''}
                onChange={(e) =>
                  setNewCommentText((prev) => ({
                    ...prev,
                    [note.id]: e.target.value,
                  }))
                }
              ></textarea>
              <button
                onClick={() => handleCommentSubmit(note.id)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
              >
                Add Comment
              </button>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Report this Note</h4>
              <textarea
                className="w-full p-2 bg-gray-800 text-gray-100 rounded mb-2"
                rows="2"
                placeholder="Reason for reporting..."
                value={reportReason[note.id] || ''}
                onChange={(e) =>
                  setReportReason((prev) => ({
                    ...prev,
                    [note.id]: e.target.value,
                  }))
                }
              ></textarea>
              <button
                onClick={() => handleReportSubmit(note.id)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
              >
                Report
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CourseNotes;
