import React, { useState } from 'react';
import axios from 'axios';
import { FiX, FiCode, FiTag } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './AskQuestion.css';
import { useNavigate } from 'react-router-dom';

const AskQuestion = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) return setError('Please enter a title');
    if (!body.trim()) return setError('Please enter question details');
    if (!tags.trim()) return setError('Please enter tags');

    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      const res = await axios.post(
        'http://localhost:5000/auth/question',
        {
          title,
          body,
          tags: tags.split(',').map(tag => tag.trim()),
        },
        {
          withCredentials: true, // Required for session auth
        }
      );

      setSuccessMessage('Question posted successfully!');
      toast.success("posted : )")
      navigate('/feed'); 
      setTimeout(() => {
        onClose(true); // Close modal after success
        
      }, 200);
    } catch (err) {
      toast.error(" Error while Posting : (")
      console.error(err);
      setError(
        err.response?.data?.message || 'Failed to post question. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const gotofeed=()=>{
       navigate('/feed')
  }

  return (
    <div className="ask-question-modal">
      <div className="modal-overlay" onClick={gotofeed} />

      <div className="modal-content">
        <div className="modal-header">
          <h2>Ask a Question</h2>
          <button className="close-btn" onClick={gotofeed} aria-label="Close">
            <FiX size={24} />
          </button>
        </div>

        {error && (
          <div className="error-message">
            <div className="error-icon">!</div>
            <div>{error}</div>
          </div>
        )}

        {successMessage && (
          <div className="success-message">
            ✅ {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">
              Title <span className="input-hint">(Be specific and concise)</span>
            </label>
            <div className="input-container">
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. How to optimize React hooks?"
                maxLength="150"
              />
              <div className="character-count">{title.length}/150</div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="body">
              Details <span className="input-hint">(Add all relevant information)</span>
            </label>
            <div className="input-container">
              <textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows="8"
                placeholder="Explain your question. Include code or examples if needed."
              />
              <div className="format-hint">
                <FiCode />
                <span>Markdown & code blocks supported</span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="tags">
              Tags <span className="input-hint">(Separate with commas)</span>
            </label>
            <div className="input-container">
              <div className="tag-icon">
                <FiTag />
              </div>
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. react, performance, hooks"
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => onClose(false)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Posting...
                </>
              ) : (
                'Post Question'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AskQuestion;
