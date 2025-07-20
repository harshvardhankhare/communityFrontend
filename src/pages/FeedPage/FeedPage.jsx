import { useState, useEffect } from "react";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import AnswerSection from "../../Components/AnswerSection/AnswerSection";

import {
  FaLightbulb,
  FaSearch,
  FaBell,
  FaEnvelope,
  FaBars,
  FaTimes,
  FaThumbsUp,
  FaThumbsDown,
  FaComment,
  FaShare,
  FaEye,
  FaEyeSlash,
  FaSpinner,
  FaHome,
  FaQuestionCircle,
  FaComments,
  FaBookmark,
  FaUsers,
  FaTags,
  FaFire,
  FaChartLine,
  FaCrown,
  FaAtom,
  FaPython,
  FaSquareRootAlt,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import "./FeedPage.css";

const FeedPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("recent");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [questions, setQuestions] = useState([]);
const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
const [error, setError] = useState(null);

  const navigate = useNavigate();

useEffect(() => {


 const fetchQuestions = async () => {
    setIsLoadingQuestions(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/question`, {
        withCredentials: true,
      });
      setQuestions(response.data); // Assuming response.data is an array of questions
    } catch (err) {
      setError('Failed to load questions');
      console.error(err);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  fetchQuestions();

  axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/check-session`, {
    withCredentials: true,
  })
    .then((res) => {
      if (!res.data.loggedIn) {
        navigate('/register');
      }
    })
    .catch((err) => {
      console.error('Session check failed:', err);
      navigate('/register');
    });
}, [])

    const subcategories = {
    math: ['Algebra', 'Calculus', 'Geometry'],
    science: ['Physics', 'Chemistry', 'Biology'],
    programming: ['JavaScript', 'Python', 'Java'],
    technology: ['AI', 'Web Dev', 'Cybersecurity']
  };
  const handleSubmit = async () => {
    if (!question.trim() || !category || !subcategory) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/question`, {
        content: question.trim(),
        category,
        subcategory,
        
      },{ withCredentials: true });
console.log(response)
      toast.success('Question posted successfully!');
      // Reset form
      setQuestion('');
      setCategory('');
      setSubcategory('');
    } catch (error) {
      toast.error('Failed to post question. Please try again.');
      console.error(error);
    }
  };

  const [passwordStrength, setPasswordStrength] = useState(0);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    // In a real app, you would filter questions here
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

const handleVote = async (id ,type) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/auth/question/${id}/vote`,
    { voteType: type },
      { withCredentials: true }
    );

    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q._id === id ? { ...q, votes: response.data.votes } : q
      )
    );

     toast.success(response.data.message || "Voted successfully!");
  } catch (error) {
    toast.error('Failed to record vote.');
    console.error(error);
  }
};


  const handleLoadMore = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // In a real app, you would append new questions here
      setIsLoading(false);
      alert("More questions would be loaded here in a real application");
    }, 1000);
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;

    // Check password length
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;

    // Check for mixed case
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;

    // Check for numbers
    if (/\d/.test(password)) strength += 1;

    // Check for special characters
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;

    return strength;
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setPasswordStrength(calculatePasswordStrength(password));
  };

  return (
    <div className="main-feed">
      <header>
        <nav className="navbar">
          <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
            <FaBars />
          </button>

          <a href="#" className="logo">
            <FaLightbulb />
            <span>SolveHub</span>
          </a>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search questions, topics, or people..."
            />
            <button type="submit">
              <FaSearch />
            </button>
          </div>

          <div className="user-nav">
            <div className="nav-icon">
              <FaBell />
              <span className="notification-badge">3</span>
            </div>
            <div className="nav-icon">
              <FaEnvelope />
              <span className="notification-badge">1</span>
            </div>
            <div className="user-avatar">
              <Link to={'/profile'}> <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="User"
              /></Link>
              
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <div
        className={`overlay ${isMobileMenuOpen ? "active" : ""}`}
        onClick={toggleMobileMenu}
      ></div>
      <div className={`mobile-menu ${isMobileMenuOpen ? "active" : ""}`}>
        <div className="mobile-menu-header">
          <h3>Menu</h3>
          <button className="close-menu" onClick={toggleMobileMenu}>
            <FaTimes />
          </button>
        </div>

        <div className="mobile-search">
          <input type="text" placeholder="Search..." />
          <button type="submit">
            <FaSearch />
          </button>
        </div>

        <div className="sidebar-section">
          <h3 className="sidebar-title">
            <FaHome />
            Navigation
          </h3>
          <ul className="sidebar-links">
            <li>
              <a href="#" className="active-link">
                <FaHome /> Home
              </a>
            </li>
            <li>
              <a href="#">
                <FaQuestionCircle /> My Questions
              </a>
            </li>
            <li>
              <a href="#">
                <FaComments /> My Answers
              </a>
            </li>
            <li>
              <a href="#">
                <FaBookmark /> Bookmarks
              </a>
            </li>
            <li>
              <a href="#">
                <FaUsers /> Communities
              </a>
            </li>
          </ul>
        </div>

        <div className="sidebar-section">
          <h3 className="sidebar-title">
            <FaTags />
            Popular Tags
          </h3>
          <div className="trending-tags">
            <span className="tag">javascript</span>
            <span className="tag">python</span>
            <span className="tag">math</span>
            <span className="tag">physics</span>
            <span className="tag">react</span>
            <span className="tag">calculus</span>
            <span className="tag">algebra</span>
            <span className="tag">chemistry</span>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Left Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-title">
              <FaHome />
              Navigation
            </h3>
            <ul className="sidebar-links">
              <li>
                <a href="#" className="active-link">
                  <FaHome /> Home
                </a>
              </li>
              <li>
                <a href="#">
                  <FaQuestionCircle /> My Questions
                </a>
              </li>
              <li>
                <a href="#">
                  <FaComments /> My Answers
                </a>
              </li>
              <li>
                <a href="#">
                  <FaBookmark /> Bookmarks
                </a>
              </li>
              <li>
                <a href="#">
                  <FaUsers /> Communities
                </a>
              </li>
            </ul>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">
              <FaTags />
              Popular Tags
            </h3>
            <div className="trending-tags">
              <span className="tag">javascript</span>
              <span className="tag">python</span>
              <span className="tag">math</span>
              <span className="tag">physics</span>
              <span className="tag">react</span>
              <span className="tag">calculus</span>
              <span className="tag">algebra</span>
              <span className="tag">chemistry</span>
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">
              <FaFire />
              Trending Communities
            </h3>
            <ul className="sidebar-links">
              <li>
                <a href="#">
                  <FcGoogle /> JavaScript Developers
                </a>
              </li>
              <li>
                <a href="#">
                  <FaSquareRootAlt /> Mathematics
                </a>
              </li>
              <li>
                <a href="#">
                  <FaAtom /> Physics Enthusiasts
                </a>
              </li>
              <li>
                <a href="#">
                  <FaPython /> Python Programmers
                </a>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <div className="ask-question-card">
            <div className="ask-question-header">
              <div className="user-avatar">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="User"
                />
              </div>
              <textarea
                className="ask-question-input"
                placeholder="What's your question?"
                 value={question}
          onChange={(e) => setQuestion(e.target.value)}
              ></textarea>
            </div>
            <div className="ask-question-footer">
              <div className="question-categories">
                <select
                  className="category-select"
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setSubcategory("");
                  }}
                >
                  <option value="">Select Category</option>
                  <option value="math">Mathematics</option>
                  <option value="science">Science</option>
                  <option value="programming">Programming</option>
                  <option value="technology">Technology</option>
                </select>
                <select className="category-select"
                 value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            disabled={!category}
                >
                 <option value="">Select Subcategory</option>
            {subcategories[category]?.map((sub) => (
              <option key={sub.toLowerCase()} value={sub.toLowerCase()}>{sub}</option>
            ))}
                </select>
              </div>
              <button className="btn btn-primary" onClick={handleSubmit}>Post Question</button>
            </div>
          </div>

          <div className="feed-filter">
            <button
              className={`filter-btn ${
                activeFilter === "recent" ? "active" : ""
              }`}
              onClick={() => handleFilterChange("recent")}
            >
              Recent
            </button>
            <button
              className={`filter-btn ${
                activeFilter === "popular" ? "active" : ""
              }`}
              onClick={() => handleFilterChange("popular")}
            >
              Popular
            </button>
            <button
              className={`filter-btn ${
                activeFilter === "unanswered" ? "active" : ""
              }`}
              onClick={() => handleFilterChange("unanswered")}
            >
              Unanswered
            </button>
            <button
              className={`filter-btn ${
                activeFilter === "following" ? "active" : ""
              }`}
              onClick={() => handleFilterChange("following")}
            >
              Following
            </button>
          </div>
           {isLoadingQuestions && <p>Loading questions...</p>}
{error && <p className="error">{error}</p>}

          { !isLoadingQuestions && !error &&  questions.map((question) => (
            <div className="question-card" key={question.id}>
              <div className="question-header">
                <div className="question-author">
                  <div className="user-avatar">
                    <img
                      src={question.user.avatar}
                      alt={question.user.name}
                    />
                  </div>
                  <div className="author-info">
                    <h4>{question.user.username}</h4>
                    <p>{question.user.email}</p>
                  </div>
                </div>
                <div className="question-time">{question.createdAt}</div>
              </div>

              <div className="question-content">
                {/* <h3>{question.title}</h3> */}
                <p>{question.content}</p>

                <div className="question-tags">
                  {question.tags.map((tag) => (
                    <span className="question-tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="question-actions">
                <div className="action-buttons">
                  <button
                    className={`action-btn ${
                      question.upvoted ? "upvoted" : ""
                    }`}
                    onClick={() => handleVote(question._id, "upvote")}
                  >
                    <FaThumbsUp />
                    <span>{question.votes}</span>
                  </button>
                  <button
                    className={`action-btn ${
                     question.upvoted ? "upvoted" : ""
                    }`}
                    onClick={() => handleVote(question._id, "downvote")}
                  >
                    <FaThumbsDown />
                    <span>{question.downvotes}</span>
                  </button>
                  {/* <button className="action-btn">
                    <FaComment />
                    <span>Comment</span>
                  </button> */}<AnswerSection questionId={question._id} />
                  <button className="action-btn">
                    <FaShare />
                    <span>Share</span>
                  </button>
                </div>

                <div className="answer-count">
                  <span></span> answers
                </div>
              </div>
            </div>
          ))}

          {/* <button
            className="btn load-more-btn"
            onClick={handleLoadMore}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <FaSpinner className="spinner" />
                Loading...
              </>
            ) : (
              "Load More Questions"
            )}
          </button> */}
        </main>

        {/* Right Sidebar */}
        <aside className="right-sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-title">
              <FaChartLine />
              Community Stats
            </h3>
            <div className="community-stats">
              <div className="stat-item">
                <div className="stat-number">1.2K</div>
                <div className="stat-label">Questions Today</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">3.5K</div>
                <div className="stat-label">Answers Today</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">45.7K</div>
                <div className="stat-label">Members</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">1.2M</div>
                <div className="stat-label">Solutions</div>
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">
              <FaCrown />
              Top Contributors
            </h3>
            <ul className="top-contributors">
              <li className="contributor">
                <div className="contributor-avatar">
                  <img
                    src="https://randomuser.me/api/portraits/men/75.jpg"
                    alt="User"
                  />
                </div>
                <div className="contributor-info">
                  <h4>David Miller</h4>
                  <p>Mathematics Expert</p>
                </div>
                <div className="contributor-points">4,521 pts</div>
              </li>
              <li className="contributor">
                <div className="contributor-avatar">
                  <img
                    src="https://randomuser.me/api/portraits/women/68.jpg"
                    alt="User"
                  />
                </div>
                <div className="contributor-info">
                  <h4>Jennifer Lee</h4>
                  <p>Physics Professor</p>
                </div>
                <div className="contributor-points">3,987 pts</div>
              </li>
              <li className="contributor">
                <div className="contributor-avatar">
                  <img
                    src="https://randomuser.me/api/portraits/men/41.jpg"
                    alt="User"
                  />
                </div>
                <div className="contributor-info">
                  <h4>Robert Taylor</h4>
                  <p>Senior Developer</p>
                </div>
                <div className="contributor-points">3,742 pts</div>
              </li>
              <li className="contributor">
                <div className="contributor-avatar">
                  <img
                    src="https://randomuser.me/api/portraits/women/33.jpg"
                    alt="User"
                  />
                </div>
                <div className="contributor-info">
                  <h4>Sophia Martinez</h4>
                  <p>Chemistry Researcher</p>
                </div>
                <div className="contributor-points">3,215 pts</div>
              </li>
              <li className="contributor">
                <div className="contributor-avatar">
                  <img
                    src="https://randomuser.me/api/portraits/men/19.jpg"
                    alt="User"
                  />
                </div>
                <div className="contributor-info">
                  <h4>James Wilson</h4>
                  <p>Data Scientist</p>
                </div>
                <div className="contributor-points">2,987 pts</div>
              </li>
            </ul>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">
              <FaLightbulb />
              Did You Know?
            </h3>
            <p className="did-you-know-text">
              You earn reputation points when your questions or answers are
              upvoted. Higher reputation unlocks special privileges like voting,
              commenting, and moderation abilities.
            </p>
            <button className="btn btn-primary learn-more-btn">
              Learn About Reputation
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default FeedPage;
