import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuthInfo } from "@propelauth/react";

function PendingNotes() {
  const { accessToken } = useAuthInfo();
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPendingNotes = async () => {
      try {
        const response = await axios.get("http://localhost:3001/notes/review", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setNotes(response.data);
      } catch (err) {
        console.error("Error fetching pending notes:", err);
        setError("Failed to load pending notes.");
      }
    };

    fetchPendingNotes();
  }, [accessToken]);

  const handleAction = async (noteId, action) => {
    try {
      await axios.patch(
        `http://localhost:3001/notes/review/${noteId}`,
        { status: action },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
    } catch (err) {
      console.error(`Error ${action}ing note ${noteId}:`, err);
      setError(`Failed to ${action} note.`);
    }
  };

  if (error) {
    return <p className="text-red-500 text-center mt-4">{error}</p>;
  }

  if (!notes.length) {
    return <p className="text-gray-400 text-center mt-4">No pending notes.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-6 bg-gray-900 text-gray-200">
      <h2 className="text-2xl font-bold text-center mb-6">Pending Notes</h2>
      <ul className="space-y-4 max-w-2xl mx-auto">
        {notes.map((note) => (
          <li key={note.id} className="bg-gray-800 shadow-md rounded-lg p-4">
            <h3 className="text-lg font-bold text-gray-200">{note.title}</h3>
            <p className="text-gray-400 text-sm mb-2">
              Author: {note.author} • Created At:{" "}
              {new Date(note.created_at).toLocaleString()}
            </p>
            <p className="text-gray-300 mb-3">Tags: {note.tags.join(", ")}</p>
            <div className="flex space-x-4">
              <button
                onClick={() => handleAction(note.id, "approved")}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Approve
              </button>
              <button
                onClick={() => handleAction(note.id, "rejected")}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PendingNotes;