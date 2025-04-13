import React, { useEffect, useState } from 'react';
import { fetchNotes, uploadNote, voteOnNote } from './api';

function Notes({ courseId }) {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: '', tags: '', file: null });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const loadNotes = async () => {
    setLoading(true);
    try {
      const data = await fetchNotes(courseId);
      setNotes(data);
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError('Failed to fetch notes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [courseId]);

  const handleFileChange = (e) => {
    setNewNote({ ...newNote, file: e.target.files[0] });
  };

  const handleUpload = async () => {
    const { title, tags, file } = newNote;
    
    if (!title || !file || !tags) {
      alert("Please fill in all fields and select a file.");
      return;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      alert("Only PDF and DOCX files are allowed.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('course_id', courseId);
      formData.append('title', title);
      formData.append('tags', tags);
      formData.append('file', file);

      await uploadNote(formData);
      alert('Note uploaded successfully! Pending review.');
      setNewNote({ title: '', tags: '', file: null });
      loadNotes();
    } catch (err) {
      console.error('Error uploading note:', err);
      alert('Error uploading note: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleVote = async (noteId, voteType) => {
    try {
      await voteOnNote(noteId, voteType);
      setNotes(prev =>
        prev.map(note =>
          note.id === noteId
            ? {
                ...note,
                helpful_votes: voteType === 'helpful' ? note.helpful_votes + 1 : note.helpful_votes,
                unhelpful_votes: voteType === 'unhelpful' ? note.unhelpful_votes + 1 : note.unhelpful_votes
              }
            : note
        )
      );
    } catch (err) {
      console.error('Error voting on note:', err);
      alert('Voting failed: ' + err.message);
    }
  };

  return (
    <div className="notes-container">
      <h2>Course Notes</h2>

      {loading ? (
        <p>Loading notes...</p>
      ) : notes.length === 0 ? (
        <p>No notes available for this course. Be the first to upload!</p>
      ) : (
        notes.map(note => (
          <div key={note.id} className="note-card">
            <h3>{note.title}</h3>
            <div className="note-actions">
              <a href={note.content} target="_blank" rel="noopener noreferrer">
                View Document
              </a>
              <div className="vote-buttons">
                <button 
                  onClick={() => handleVote(note.id, 'helpful')}
                  title="Mark as helpful"
                >
                  👍 {note.helpful_votes}
                </button>
                <button 
                  onClick={() => handleVote(note.id, 'unhelpful')}
                  title="Mark as unhelpful"
                >
                  👎 {note.unhelpful_votes}
                </button>
              </div>
            </div>
            <div className="note-meta">
              <span>Uploaded by: {note.author}</span>
              <span>Tags: {note.tags.join(', ')}</span>
              <span>Uploaded: {new Date(note.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))
      )}

      <div className="upload-section">
        <h3>Upload New Note</h3>
        <input
          type="text"
          placeholder="Note Title"
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
        />
        <input
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.docx"
        />
        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={newNote.tags}
          onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
        />
        <button 
          onClick={handleUpload} 
          disabled={uploading}
          className="upload-button"
        >
          {uploading ? "Uploading..." : "Upload to Google Drive"}
        </button>
        <p className="upload-notice">
          All uploads are subject to review. Supported formats: PDF, DOCX.
        </p>
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default Notes;