import { useState, useEffect } from 'react';

import { FaLightbulb, FaSearch, FaThumbsUp, FaComment, FaShare, FaHome, FaQuestionCircle, FaComments, FaTrophy, FaTags, FaFire } from 'react-icons/fa';
import "./Home.css"
import { Link } from 'react-router-dom';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleTabChange = (category) => {
    setActiveTab(category);
    // In a real app, you would filter questions here
  };

  const animateStats = () => {
    const statNumbers = document.querySelectorAll('.stat-number');
    const speed = 200;

    statNumbers.forEach(stat => {
      const target = parseInt(stat.textContent.replace('+', ''));
      const count = 0;
      const increment = target / speed;

      const updateCount = () => {
        const currentCount = parseInt(stat.textContent.replace('+', ''));
        
        if (currentCount < target) {
          stat.textContent = Math.ceil(currentCount + increment) + '+';
          setTimeout(updateCount, 1);
        } else {
          stat.textContent = target + '+';
        }
      };

      stat.textContent = '0+';
      updateCount();
    });
  };

  useEffect(() => {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateStats();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
      statsObserver.observe(statsSection);
    }

    return () => {
      if (statsSection) {
        statsObserver.unobserve(statsSection);
      }
    };
  }, []);

  return (
    <div className="front-page">
      <header className={isScrolled ? 'scrolled' : ''}>
        <nav className="navbar">
          <a href="#" className="logo">
            <FaLightbulb />
            <span>SolveHub</span>
          </a>
          
          <button className="menu-toggle" onClick={toggleMenu}>
            <i className="fas fa-bars"></i>
          </button>
          
          <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <li><a href="#">Home</a></li>
            <li><a href="#">Questions</a></li>
            <li><a href="#">Categories</a></li>
            <li><a href="#">Experts</a></li>
            <li><a href="#">About</a></li>
          </ul>
          
          <div className={`auth-buttons ${isMenuOpen ? 'active' : ''}`}>
          
            <Link  to={"/register"} className="btn btn-login">Log In</Link>
            <Link  to={"/register"} className="btn btn-signup">Sign Up</Link>
            
          </div>
        </nav>
      </header>
      
      <section className="hero">
        <div className="hero-content animate-fadeIn">
          <h1 className="delay-1">Get Answers to Your Questions</h1>
          <p className="delay-2">Join our community of learners and experts helping each other solve problems and share knowledge.</p>
          
          <div className="search-bar delay-3">
            <input type="text" placeholder="Search for questions or topics..." />
            <button type="submit"><FaSearch /></button>
          </div>
          
          <div className="stats delay-4">
            <div className="stat-item">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">Questions Answered</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">5,000+</div>
              <div className="stat-label">Active Members</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100+</div>
              <div className="stat-label">Categories</div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="features">
        <div className="section-title animate-fadeIn">
          <h2 className="delay-1">How It Works</h2>
          <p className="delay-2">SolveHub connects people who need help with those who can provide it</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card animate-fadeIn delay-1">
            <div className="feature-icon">
              <FaQuestionCircle />
            </div>
            <h3>Ask Questions</h3>
            <p>Post your questions to the community and get answers from knowledgeable people across various fields.</p>
          </div>
          
          <div className="feature-card animate-fadeIn delay-2">
            <div className="feature-icon">
              <FaComments />
            </div>
            <h3>Answer Questions</h3>
            <p>Share your knowledge by answering questions and helping others learn. Build your reputation.</p>
          </div>
          
          <div className="feature-card animate-fadeIn delay-3">
            <div className="feature-icon">
              <FaTrophy />
            </div>
            <h3>Earn Recognition</h3>
            <p>Gain points and badges for your contributions. Top contributors get special recognition.</p>
          </div>
        </div>
      </section>
      
      <section className="popular-questions">
        <div className="questions-container">
          <div className="section-title animate-fadeIn">
            <h2 className="delay-1">Popular Questions</h2>
            <p className="delay-2">Recently asked questions getting lots of attention</p>
          </div>
          
          <div className="question-tabs animate-fadeIn delay-2">
            <button 
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`} 
              onClick={() => handleTabChange('all')}
            >
              All
            </button>
            <button 
              className={`tab-btn ${activeTab === 'math' ? 'active' : ''}`} 
              onClick={() => handleTabChange('math')}
            >
              Mathematics
            </button>
            <button 
              className={`tab-btn ${activeTab === 'science' ? 'active' : ''}`} 
              onClick={() => handleTabChange('science')}
            >
              Science
            </button>
            <button 
              className={`tab-btn ${activeTab === 'tech' ? 'active' : ''}`} 
              onClick={() => handleTabChange('tech')}
            >
              Technology
            </button>
          </div>
          
          <ul className="questions-list">
            <li className="question-item animate-fadeIn delay-1">
              <div className="question-header">
                <a href="#" className="question-title">How do I solve this quadratic equation using the quadratic formula?</a>
                <div className="question-tags">
                  <span className="tag">math</span>
                  <span className="tag">algebra</span>
                </div>
              </div>
              <div className="question-meta">
                <div className="question-author">
                  <div className="author-avatar">JD</div>
                  <span>John Doe</span>
                </div>
                <div className="question-stats">
                  <div className="stat"><FaThumbsUp /> 24</div>
                  <div className="stat"><FaComment /> 12</div>
                </div>
              </div>
            </li>
            
            <li className="question-item animate-fadeIn delay-2">
              <div className="question-header">
                <a href="#" className="question-title">What's the difference between classical and quantum physics?</a>
                <div className="question-tags">
                  <span className="tag">science</span>
                  <span className="tag">physics</span>
                </div>
              </div>
              <div className="question-meta">
                <div className="question-author">
                  <div className="author-avatar">AS</div>
                  <span>Alice Smith</span>
                </div>
                <div className="question-stats">
                  <div className="stat"><FaThumbsUp /> 18</div>
                  <div className="stat"><FaComment /> 8</div>
                </div>
              </div>
            </li>
            
            <li className="question-item animate-fadeIn delay-3">
              <div className="question-header">
                <a href="#" className="question-title">How does blockchain technology work in simple terms?</a>
                <div className="question-tags">
                  <span className="tag">tech</span>
                  <span className="tag">blockchain</span>
                  <span className="tag">cryptocurrency</span>
                </div>
              </div>
              <div className="question-meta">
                <div className="question-author">
                  <div className="author-avatar">RJ</div>
                  <span>Robert Johnson</span>
                </div>
                <div className="question-stats">
                  <div className="stat"><FaThumbsUp /> 32</div>
                  <div className="stat"><FaComment /> 15</div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </section>
      
      <section className="cta animate-fadeIn delay-1">
        <h2>Ready to Join Our Community?</h2>
        <p>Sign up now to start asking questions, sharing knowledge, and connecting with other learners and experts.</p>
        <a href="#" className="btn-cta">Get Started - It's Free!</a>
      </section>
      
      <footer>
        <div className="footer-content">
          <div className="footer-column">
            <h3>SolveHub</h3>
            <p>A community-driven platform for learning and problem solving through questions and answers.</p>
            <div className="social-links">
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-linkedin-in"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
          
          <div className="footer-column">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><a href="#">Home</a></li>
              <li><a href="#">Questions</a></li>
              <li><a href="#">Categories</a></li>
              <li><a href="#">Experts</a></li>
              <li><a href="#">About Us</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3>Categories</h3>
            <ul className="footer-links">
              <li><a href="#">Mathematics</a></li>
              <li><a href="#">Science</a></li>
              <li><a href="#">Technology</a></li>
              <li><a href="#">Programming</a></li>
              <li><a href="#">Business</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3>Support</h3>
            <ul className="footer-links">
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Community Guidelines</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="copyright">
          <p>&copy; 2025 SolveHub. All rights reserved.</p>
        </div>
      </footer>

      
    </div>
  );
};

export default Home;