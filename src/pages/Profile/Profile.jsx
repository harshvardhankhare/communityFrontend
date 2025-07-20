import React, { useState, useEffect } from 'react';
import { FiUser, FiMapPin, FiMail, FiCalendar, FiGithub, FiTwitter, FiLinkedin, FiEdit, FiSettings } from 'react-icons/fi';
import { FaRegStar, FaRegComment } from 'react-icons/fa';
import { RiCodeSSlashLine } from 'react-icons/ri';
import './Profile.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('questions');
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  

  const [profile, setProfile] = useState({
    name: '',
    username: '',
    bio: '',
    email: '',
    joinDate: '',
    location: '',
    github: '',
    twitter: '',
    linkedin: '',
    stats: {
      questions: 0,
      answers: 0,
      solutions: 0,
      reputation: 0
    }
  });

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
          withCredentials: true,
        });
        setCurrentUser(res.data);

        // Fill profile fields
        setProfile({
          name: res.data.name || '',
          username: res.data.username || '',
          bio: res.data.bio || '',
          email: res.data.email || '',
          joinDate: new Date(res.data.joinDate).toDateString(),
          location: res.data.location || '',
          github: res.data.github || '',
          twitter: res.data.twitter || '',
          linkedin: res.data.linkedin || '',
          stats: res.data.stats || {
            questions: 0,
            answers: 0,
            solutions: 0,
            reputation: 0
          }
        });
      } catch (err) {
        console.error("Not logged in, redirecting...");
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentUser();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {}, { withCredentials: true });
      toast.success(" LogOut We Will Miss You")
      navigate('/');  // redirect to login or home
    } catch (err) {
      toast.error("Logout Failed Please Stay Here")
      console.error('Logout failed:', err);
    }
  };

  if (loading) return <div className="profile-page">Loading...</div>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-large">{profile.name ? profile.name.charAt(0) : 'U'}</div>
          {editMode && (
            <button className="edit-avatar-btn">
              <FiEdit size={14} />
            </button>
          )}
        </div>

        <div className="profile-info">
          {editMode ? (
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleInputChange}
              className="edit-input"
            />
          ) : (
            <h1>{profile.name}</h1>
          )}

          <div className="username">@{profile.username}</div>

          {editMode ? (
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleInputChange}
              className="edit-textarea"
              rows="3"
            />
          ) : (
            <p className="bio">{profile.bio}</p>
          )}

          <div className="profile-meta">
            <div className="meta-item">
              <FiMail className="meta-icon" />
              {editMode ? (
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  className="edit-input small"
                />
              ) : (
                <span>{profile.email}</span>
              )}
            </div>
            <div className="meta-item">
              <FiCalendar className="meta-icon" />
              <span>{profile.joinDate}</span>
            </div>
            <div className="meta-item">
              <FiMapPin className="meta-icon" />
              <span>{profile.location}</span>
            </div>
          </div>

          <div className="social-links">
            {profile.github && (
              <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer">
                <FiGithub />
              </a>
            )}
            {profile.twitter && (
              <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noopener noreferrer">
                <FiTwitter />
              </a>
            )}
            {profile.linkedin && (
              <a href={`https://linkedin.com/in/${profile.linkedin}`} target="_blank" rel="noopener noreferrer">
                <FiLinkedin />
              </a>
            )}
          </div>
        </div>

        <div className="profile-actions">
          <button
            className={`edit-btn `}

          >
            <Link to="/editprofile" style={{ color: "white" }}>Edit</Link>
          </button>
          <button
            className={`edit-btn `}
onClick={handleLogout}
          >
            Logout
          </button>


          <button className="settings-btn">
            <FiSettings />
          </button>
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-card">
          <div className="stat-value">{profile.stats.reputation}</div>
          <div className="stat-label">Reputation</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{profile.stats.questions}</div>
          <div className="stat-label">Questions</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{profile.stats.answers}</div>
          <div className="stat-label">Answers</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{profile.stats.solutions}</div>
          <div className="stat-label">Solutions</div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-tabs">
          <button
            className={`tab-btn ${activeTab === 'questions' ? 'active' : ''}`}
            onClick={() => setActiveTab('questions')}
          >
            <RiCodeSSlashLine /> Questions
          </button>
          <button
            className={`tab-btn ${activeTab === 'answers' ? 'active' : ''}`}
            onClick={() => setActiveTab('answers')}
          >
            <FaRegComment /> Answers
          </button>
          <button
            className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            <FaRegStar /> Saved
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'questions' && (
            <div className="questions-list">
              <p>No questions posted yet.</p>
            </div>
          )}
          {activeTab === 'answers' && (
            <div className="answers-list">
              <p>No answers yet.</p>
            </div>
          )}
          {activeTab === 'saved' && (
            <div className="empty-state">
              <FaRegStar size={48} className="empty-icon" />
              <h3>No saved items yet</h3>
              <p>Save questions and answers to find them easily later</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
