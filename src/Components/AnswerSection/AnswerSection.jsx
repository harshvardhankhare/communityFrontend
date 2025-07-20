import { useState, useEffect } from 'react';
import axios from 'axios';

const AnswerSection = ({ questionId }) => {
  const [showAnswers, setShowAnswers] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState('');

  const fetchAnswers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/answers/${questionId}`);
      setAnswers(res.data.answers);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = () => {
    setShowAnswers(prev => !prev);
    if (!showAnswers) fetchAnswers();
  };

  const handleSubmit = async () => {
    if (!newAnswer.trim()) return;
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/answers`,
        {
          questionId,
          body: newAnswer,
        },
        { withCredentials: true }
      );
      setNewAnswer('');
      fetchAnswers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ marginTop: '10px' }}>
      <button className="action-btn" onClick={handleToggle}>
        💬 <span>Comment</span>
      </button>

      {showAnswers && (
        <div className="answer-section">
          <h4 style={{ marginTop: '10px' }}>Answers</h4>
          {answers.length === 0 ? (
            <p>No answers yet.</p>
          ) : (
            <ul style={{ paddingLeft: '20px' }}>
              {answers.map((answer) => (
                <li key={answer._id}>
                  <strong>{answer.user?.username || "Anonymous"}</strong>: {answer.body}
                </li>
              ))}
            </ul>
          )}

          <textarea
            placeholder="Write your answer..."
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            style={{ width: '100%', marginTop: '10px', padding: '6px' }}
          />
          <button onClick={handleSubmit} className="btn btn-primary" style={{ marginTop: '5px' }}>
            Submit Answer
          </button>
        </div>
      )}
    </div>
  );
};

export default AnswerSection;
