import React, { useState, useEffect } from "react";
import { useAuthInfo } from "@propelauth/react";
import { fetchPendingNotes, updateNoteStatus } from "../../api/api"; // Import the API functions

function PendingNotes() {
  const { accessToken } = useAuthInfo();
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const getPendingNotes = async () => {
      try {
        const data = await fetchPendingNotes(accessToken); // Use the API function
        setNotes(data);
      } catch (err) {
        console.error("Error fetching pending notes:", err);
        setError("Failed to load pending notes.");
      }
    };

    getPendingNotes();
  }, [accessToken]);

  const handleAction = async (noteId, action) => {
    try {
      await updateNoteStatus(accessToken, noteId, action); // Use the API function
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