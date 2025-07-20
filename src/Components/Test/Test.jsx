import React, { useState, useEffect } from 'react';
import { FiMessageSquare, FiClock, FiTrendingUp, FiEye, FiThumbsUp } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Test.css';

const Test = () => {
  const [activeTab, setActiveTab] = useState('week');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchPopularQuestions = async () => {
      setLoading(true);
      try {
        // Simulate API call
        const res = await axios.get('http://localhost:5000/auth/questions/popular');
        console.log(res.data)
        setQuestions(res.data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPopularQuestions();
  }, [activeTab]);

  const getTimeFrameText = () => {
    switch(activeTab) {
      case 'day':
        return 'today';
      case 'week':
        return 'this week';
      case 'month':
        return 'this month';
      case 'year':
        return 'this year';
      default:
        return '';
    }
  };

  return (
    <div className="popular-questions-container">
      <div className="popular-header">
        <h1>
          <FiTrendingUp className="trending-icon" />
          Popular Questions
        </h1>
        <p>Most viewed and voted questions {getTimeFrameText()}</p>
        
        <div className="popular-tabs">
          <button
            className={`tab-btn ${activeTab === 'day' ? 'active' : ''}`}
            onClick={() => setActiveTab('day')}
          >
            Today
          </button>
          <button
            className={`tab-btn ${activeTab === 'week' ? 'active' : ''}`}
            onClick={() => setActiveTab('week')}
          >
            This Week
          </button>
          <button
            className={`tab-btn ${activeTab === 'month' ? 'active' : ''}`}
            onClick={() => setActiveTab('month')}
          >
            This Month
          </button>
          <button
            className={`tab-btn ${activeTab === 'year' ? 'active' : ''}`}
            onClick={() => setActiveTab('year')}
          >
            This Year
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-skeleton">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="question-skeleton">
              <div className="skeleton-line title"></div>
              <div className="skeleton-line meta"></div>
              <div className="skeleton-line tags"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="questions-list">
          {questions.map(question => (
            <div key={question.id} className="question-card">
              <div className="question-stats">
                <div className="stat">
                  <span className="value">{question.votes}</span>
                  <span className="label">votes</span>
                </div>
                <div className="stat">
                  <span className="value">{question.answers}</span>
                  <span className="label">answers</span>
                </div>
                <div className="stat">
                  <span className="value">{question.views}</span>
                  <span className="label">views</span>
                </div>
              </div>
              
              <div className="question-content">
                <h3>
                  <Link to={`/questions/${question.id}`}>{question.title}</Link>
                </h3>
                <div className="question-meta">
                  <div className="tags">
                    {question.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                  <div className="author-time">
                    <span className="author">@{question.author}</span>
                    <span className="time">
                      <FiClock /> {question.time}
                    </span>
                  </div>
                </div>
              </div>
              
              {question.trending && (
                <div className="trending-badge">
                  <FiTrendingUp /> Trending
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {!loading && questions.length === 0 && (
        <div className="empty-state">
          <FiMessageSquare size={48} className="empty-icon" />
          <h3>No popular questions found</h3>
          <p>Be the first to ask a trending question!</p>
        </div>
      )}
    </div>
  );
};

export default Test;