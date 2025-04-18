import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuthInfo } from "@propelauth/react";
import axios from "axios";

function CourseNotes() {
  const { courseId } = useParams();
  const { accessToken, user } = useAuthInfo();

  const [notes, setNotes] = useState([]);
  const [commentsByNote, setCommentsByNote] = useState({});
  const [newCommentText, setNewCommentText] = useState({});
  const [commentsVisible, setCommentsVisible] = useState({});
  const [propelauthUserId, setPropelAuthUserId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/notes/${courseId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setNotes(response.data);
        // console.log("propelauthUser", notes[0].propel_user_id);
      } catch (err) {
        console.error("Error fetching notes:", err);
        setError("Failed to load notes.");
      }
    };

    fetchNotes();
  }, [courseId, accessToken]);

  const handleFetchComments = async (noteId) => {
    try {
      setCommentsVisible((prev) => ({
        ...prev,
        [noteId]: !prev[noteId], // Toggle visibility
      }));

      if (!commentsVisible[noteId]) {
        const response = await axios.get(`http://localhost:3001/notes/${noteId}/comments`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setCommentsByNote((prev) => ({ ...prev, [noteId]: response.data }));
      }
    } catch (err) {
      console.error(`Error fetching comments for note ${noteId}:`, err);
    }
  };

  const handleAddComment = async (noteId) => {
    const text = newCommentText[noteId]?.trim();
    if (!text) return;

    try {
      await axios.post(
        `http://localhost:3001/notes/${noteId}/comments`,
        { content: text, user_id: user.userId },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setNewCommentText((prev) => ({ ...prev, [noteId]: "" })); // Clear input
      handleFetchComments(noteId); // Refresh comments
    } catch (err) {
      console.error(`Error adding comment to note ${noteId}:`, err);
    }
  };

  const handleDeleteComment = async (noteId, commentId) => {
    try {
      await axios.delete(`http://localhost:3001/notes/${noteId}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      handleFetchComments(noteId); // Refresh comments
    } catch (err) {
      console.error(`Error deleting comment ${commentId}:`, err);
    }
  };

  const handleVote = async (noteId, voteType) => {
    try {
      await axios.post(
        `http://localhost:3001/notes/${noteId}/vote`,
        { vote_type: voteType, user_id: user.userId },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      const response = await axios.get(`http://localhost:3001/notes/${courseId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setNotes(response.data); // Refresh notes
    } catch (err) {
      console.error(`Error voting on note ${noteId}:`, err);
    }
  };

  const handleDeleteNote = async (noteId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this note?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3001/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId)); // Remove the deleted note from the state
      alert("Note deleted successfully.");
    } catch (err) {
      console.error("Error deleting note:", err);
      alert("Failed to delete the note.");
    }
  };

  if (error) {
    return <p className="text-red-500 text-center mt-4">{error}</p>;
  }

  if (!notes.length) {
    return <p className="text-gray-400 text-center mt-4">No notes available for this course.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-6 bg-gray-900 text-gray-200">
      <h2 className="text-2xl font-bold text-center mb-6">Course Notes</h2>
      <ul className="space-y-4 max-w-2xl mx-auto">
        {notes.map((note) => (
          <li key={note.id} className="bg-gray-800 shadow-md rounded-lg p-4">
            <h3 className="text-lg font-bold text-gray-200">{note.title}</h3>
            <p className="text-gray-400 text-sm mb-2">
              Author: {note.author} • Created At: {new Date(note.created_at).toLocaleString()}
            </p>
            <p className="text-gray-300 mb-3">Tags: {note.tags?.join(", ")}</p>

            {/* Download Button */}
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
              {/* Upvote Button */}
              <div onClick={() => handleVote(note.id, "upvote")} className="cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="currentColor"
                  className="bi bi-arrow-up-circle"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z"
                  />
                </svg>
                <p className="text-gray-400 text-sm text-center">{note.helpful_votes}</p>
              </div>

              {/* Downvote Button */}
              <div onClick={() => handleVote(note.id, "downvote")} className="cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  fill="currentColor"
                  className="bi bi-arrow-down-circle"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z"
                  />
                </svg>
                <p className="text-gray-400 text-sm text-center">{note.unhelpful_votes}</p>
              </div>

              {/* Delete Button */}
              {note.propel_user_id === user?.userId && (
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="nf nf-fa-trash text-3xl text-red-500 hover:text-red-600"
                  >
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4">
              <button
                onClick={() => handleFetchComments(note.id)}
                className="text-blue-500 hover:underline"
              >
                {commentsVisible[note.id] ? "Hide Comments" : "View Comments"}
              </button>
              {commentsVisible[note.id] && commentsByNote[note.id] && (
                <ul className="mt-2 space-y-2">
                  {commentsByNote[note.id].map((comment) => (
                    <li key={comment.id} className="text-gray-400 text-sm">
                      <p className="font-semibold text-gray-200">
                        {comment.author} • {new Date(comment.created_at).toLocaleString()}
                      </p>
                      <p>{comment.content}</p>
                      {comment.user_id === user?.userId && (
                        <button
                          onClick={() => handleDeleteComment(note.id, comment.id)}
                          className="text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-2">
                <input
                  type="text"
                  value={newCommentText[note.id] || ""}
                  onChange={(e) =>
                    setNewCommentText((prev) => ({ ...prev, [note.id]: e.target.value }))
                  }
                  placeholder="Write a comment..."
                  className="w-full px-4 py-2 bg-gray-900 text-gray-200 rounded"
                />
                <button
                  onClick={() => handleAddComment(note.id)}
                  className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Add Comment
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CourseNotes;
