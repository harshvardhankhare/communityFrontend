import { useState, useEffect } from 'react';
import { FaLightbulb, FaSearch, FaEnvelope, FaEye, FaEyeSlash, FaLock, FaUser, FaSpinner } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';


const Register = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
const navigate = useNavigate();
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Calculate password strength
    if (name === 'password') {
      calculatePasswordStrength(value);
    }
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
    
    setPasswordStrength(strength);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (isLogin) {
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
      
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    } else {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
      
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
      else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      
      if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  setIsLoading(true);
  try {
    if (isLogin) {
      // ✅ LOGIN API
      const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        email: formData.email,
        password: formData.password
      }, { withCredentials: true });

      toast.success(data.message || 'Login successful!');
      navigate('/feed');

    } else {
      // ✅ REGISTER API
      const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
        username: formData.firstName + ' ' + formData.lastName,
        email: formData.email,
        password: formData.password
      });

      toast.success(data.message || 'Account created!');
      setIsLogin(true); // Switch to login mode
       // If you have separate login route
    }
  } catch (err) {
    const msg = err.response?.data?.message || 'Something went wrong';
    toast.error(msg);
  } finally {
    setIsLoading(false);
  }
};


  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return 'var(--danger-color)';
    if (passwordStrength <= 3) return 'var(--warning-color)';
    return 'var(--success-color)';
  };

  return (
    <div className="auth-page">
      <nav className="navbar">
        <a href="#" className="logo">
          <FaLightbulb />
          <span>SolveHub</span>
        </a>
      </nav>
      
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>{isLogin ? 'Welcome Back!' : 'Join Our Community'}</h1>
            <p>{isLogin ? 'Log in to your account to continue your learning journey' : 'Create your account to start asking and answering questions'}</p>
          </div>
          
          <div className="auth-body">
            <button className="btn btn-google">
              <FcGoogle />
              <span>Continue with Google</span>
            </button>
            
            <div className="divider">or {isLogin ? 'log in' : 'sign up'} with email</div>
            
            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="name-fields">
                  <div className={`form-group ${errors.firstName ? 'error' : ''}`}>
                    <label htmlFor="firstName">First Name</label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Enter your first name"
                      />
                      <span className="input-icon"><FaUser /></span>
                    </div>
                    {errors.firstName && <div className="error-message">{errors.firstName}</div>}
                  </div>
                  
                  <div className={`form-group ${errors.lastName ? 'error' : ''}`}>
                    <label htmlFor="lastName">Last Name</label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Enter your last name"
                      />
                      <span className="input-icon"><FaUser /></span>
                    </div>
                    {errors.lastName && <div className="error-message">{errors.lastName}</div>}
                  </div>
                </div>
              )}
              
              <div className={`form-group ${errors.email ? 'error' : ''}`}>
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />
                  <span className="input-icon"><FaEnvelope /></span>
                </div>
                {errors.email && <div className="error-message">{errors.email}</div>}
              </div>
              
              <div className={`form-group ${errors.password ? 'error' : ''}`}>
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={isLogin ? 'Enter your password' : 'Create a password'}
                  />
                  <span 
                    className="input-icon password-toggle"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {!isLogin && (
                  <div className="password-strength">
                    <div 
                      className="strength-meter"
                      style={{
                        width: `${passwordStrength * 20}%`,
                        backgroundColor: getPasswordStrengthColor()
                      }}
                    ></div>
                  </div>
                )}
                {errors.password && <div className="error-message">{errors.password}</div>}
              </div>
              
              {!isLogin && (
                <div className={`form-group ${errors.confirmPassword ? 'error' : ''}`}>
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="input-wrapper">
                    <input
                      type={confirmPasswordVisible ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                    />
                    <span 
                      className="input-icon password-toggle"
                      onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                    >
                      {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
                </div>
              )}
              
              {isLogin ? (
                <div className="remember-forgot">
                  <div className="remember-me">
                    <input
                      type="checkbox"
                      id="remember"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                    />
                    <label htmlFor="remember">Remember me</label>
                  </div>
                  <a href="#" className="forgot-password">Forgot password?</a>
                </div>
              ) : (
                <div className={`terms ${errors.agreeTerms ? 'error' : ''}`}>
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                  />
                  <label htmlFor="agreeTerms">
                    I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                  </label>
                  {errors.agreeTerms && <div className="error-message">{errors.agreeTerms}</div>}
                </div>
              )}
              
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <FaSpinner className="spinner" />
                    {isLogin ? 'Logging in...' : 'Creating account...'}
                  </>
                ) : (
                  isLogin ? 'Log In' : 'Create Account'
                )}
              </button>
            </form>
            
            <div className="auth-footer">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button onClick={toggleAuthMode} className="auth-toggle-btn">
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <footer>
        <div className="footer-links">
          <a href="#">About</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Help Center</a>
        </div>
        <p>&copy; 2023 SolveHub. All rights reserved.</p>
      </footer>

      <style jsx>{`
        :root {
          --primary-color: #4361ee;
          --secondary-color: #3f37c9;
          --accent-color: #4cc9f0;
          --light-color: #f8f9fa;
          --dark-color: #212529;
          --success-color: #4bb543;
          --warning-color: #ffcc00;
          --danger-color: #f44336;
          --gray-light: #e9ecef;
          --gray-medium: #adb5bd;
          --gray-dark: #495057;
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .auth-page {
          background-color: #f5f7fb;
          color: var(--dark-color);
          line-height: 1.6;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        
        .navbar {
          background-color: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 1rem 5%;
        }
        
        .logo {
          display: flex;
          align-items: center;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary-color);
          text-decoration: none;
        }
        
        .logo svg {
          margin-right: 0.5rem;
          color: var(--accent-color);
        }
        
        .auth-container {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
          padding: 2rem;
        }
        
        .auth-card {
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 450px;
          overflow: hidden;
        }
        
        .auth-header {
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
          color: white;
          padding: 2rem;
          text-align: center;
        }
        
        .auth-header h1 {
          font-size: 1.8rem;
          margin-bottom: 0.5rem;
        }
        
        .auth-header p {
          opacity: 0.9;
          font-size: 0.95rem;
        }
        
        .auth-body {
          padding: 2rem;
        }
        
        .btn {
          display: inline-block;
          padding: 0.8rem 1.5rem;
          border-radius: 5px;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.3s;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .btn-google {
          background-color: white;
          color: var(--dark-color);
          border: 1px solid var(--gray-light);
          margin-bottom: 1rem;
        }
        
        .btn-google:hover {
          background-color: var(--gray-light);
        }
        
        .btn-primary {
          background-color: var(--primary-color);
          color: white;
        }
        
        .btn-primary:hover {
          background-color: var(--secondary-color);
        }
        
        .btn-primary:disabled {
          background-color: var(--gray-medium);
          cursor: not-allowed;
        }
        
        .divider {
          display: flex;
          align-items: center;
          margin: 1.5rem 0;
          color: var(--gray-medium);
          font-size: 0.9rem;
        }
        
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background-color: var(--gray-light);
          margin: 0 0.5rem;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: var(--gray-dark);
        }
        
        .input-wrapper {
          position: relative;
        }
        
        .form-group input {
          width: 100%;
          padding: 0.8rem 1rem 0.8rem 2.5rem;
          border: 1px solid var(--gray-light);
          border-radius: 5px;
          font-size: 1rem;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        
        .form-group input:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.2);
        }
        
        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--gray-medium);
        }
        
        .password-toggle {
          cursor: pointer;
          right: 1rem;
          left: auto;
          transition: color 0.3s;
        }
        
        .password-toggle:hover {
          color: var(--primary-color);
        }
        
        .name-fields {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        
        .remember-forgot {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .remember-me {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .remember-me input {
          width: 16px;
          height: 16px;
        }
        
        .forgot-password {
          color: var(--primary-color);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.3s;
        }
        
        .forgot-password:hover {
          color: var(--secondary-color);
        }
        
        .terms {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }
        
        .terms input {
          margin-top: 0.3rem;
        }
        
        .terms label {
          font-size: 0.9rem;
          color: var(--gray-dark);
        }
        
        .terms a {
          color: var(--primary-color);
          text-decoration: none;
        }
        
        .auth-footer {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.95rem;
          color: var(--gray-dark);
        }
        
        .auth-toggle-btn {
          background: none;
          border: none;
          color: var(--primary-color);
          text-decoration: none;
          font-weight: 500;
          cursor: pointer;
          margin-left: 0.5rem;
          transition: color 0.3s;
        }
        
        .auth-toggle-btn:hover {
          color: var(--secondary-color);
        }
        
        footer {
          background-color: var(--dark-color);
          color: white;
          padding: 1.5rem 5%;
          text-align: center;
          font-size: 0.9rem;
        }
        
        .footer-links {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }
        
        .footer-links a {
          color: #bbb;
          text-decoration: none;
          transition: color 0.3s;
        }
        
        .footer-links a:hover {
          color: white;
        }
        
        /* Error states */
        .form-group.error input {
          border-color: var(--danger-color);
        }
        
        .error-message {
          color: var(--danger-color);
          font-size: 0.9rem;
          margin-top: 0.5rem;
        }
        
        .terms.error label {
          color: var(--danger-color);
        }
        
        /* Password strength */
        .password-strength {
          height: 4px;
          background-color: var(--gray-light);
          margin-top: 0.5rem;
          border-radius: 2px;
          overflow: hidden;
        }
        
        .strength-meter {
          height: 100%;
          width: 0;
          transition: width 0.3s, background-color 0.3s;
        }
        
        /* Loading spinner */
        .spinner {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        /* Responsive styles */
        @media (max-width: 768px) {
          .auth-container {
            padding: 1rem;
          }
          
          .auth-card {
            border-radius: 0;
            box-shadow: none;
          }
          
          .name-fields {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Register;