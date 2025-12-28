// @ts-nocheck
import React, { useState } from 'react';
import { X, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, defaultTab = 'login' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login, register } = useAuth();

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const resetForms = () => {
    setLoginData({ email: '', password: '', rememberMe: false });
    setRegisterData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    });
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const validateLogin = () => {
    const newErrors = {};
    
    if (!loginData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!loginData.password) {
      newErrors.password = 'Password is required';
    } else if (loginData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegister = () => {
    const newErrors = {};
    
    if (!registerData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!registerData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!registerData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!registerData.password) {
      newErrors.password = 'Password is required';
    } else if (registerData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!registerData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!registerData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateLogin()) return;

    setLoading(true);
    setErrors({});

    try {
      const result = await login({
        email: loginData.email,
        password: loginData.password,
      });

      if (result.success) {
        resetForms();
        onClose();
      } else {
        setErrors({ submit: result.message || 'Login failed. Please try again.' });
      }
    } catch (error) {
      setErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateRegister()) return;

    setLoading(true);
    setErrors({});

    try {
      const result = await register({
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        email: registerData.email,
        password: registerData.password,
      });

      if (result.success) {
        resetForms();
        onClose();
      } else {
        setErrors({ submit: result.message || 'Registration failed. Please try again.' });
      }
    } catch (error) {
      setErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={handleOverlayClick}>
      <div className="auth-modal">
        <button 
          className="auth-modal-close" 
          onClick={() => {
            resetForms();
            onClose();
          }}
          aria-label="Close"
        >
          <X 

          size={24} />
        </button>

        <div className="auth-modal-header">
          <h2>{activeTab === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
          <p>
            {activeTab === 'login' 
              ? 'Login to access your investment portfolio' 
              : 'Join us to start your investment journey'}
          </p>
        </div>

        <div className="auth-modal-tabs">
          <button
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('login');
              resetForms();
            }}
          >
            Login
          </button>
          <button
            className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('register');
              resetForms();
            }}
          >
            Register
          </button>
        </div>

        {errors.

        submit && (
          <div className="auth-alert auth-alert-error">
            {errors.

            submit}
          </div>
        )}

        {activeTab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="auth-form">
            <div className="auth-form-group">
              <label htmlFor="login-email">
                <Mail 

                size={16} />
                Email Address
              </label>
              <input
                type="email"
                id="login-email"
                value={loginData.email}
                onChange={(e) => {
                  setLoginData({ ...loginData, email: e.target.value });
                  
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                placeholder="you@example.com"
                disabled={loading}
                
                className={errors.email ? 'error' : ''}
              />
              {errors.

              email && <span className="auth-error">{errors.email}</span>}
            </div>

            <div className="auth-form-group">
              <label htmlFor="login-password">
                <Lock 

                size={16} />
                Password
              </label>
              <div className="auth-password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="login-password"
                  value={loginData.password}
                  onChange={(e) => {
                    setLoginData({ ...loginData, password: e.target.value });
                    
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  placeholder="Enter your password"
                  disabled={loading}
                  
                  className={errors.password ? 'error' : ''}
                />
                <button
                  type="button"
                  className="auth-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff 

                  size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.

              password && <span className="auth-error">{errors.password}</span>}
            </div>

            <div className="auth-form-options">
              <label className="auth-checkbox">
                <input
                  type="checkbox"
                  checked={loginData.rememberMe}
                  onChange={(e) => setLoginData({ ...loginData, rememberMe: e.target.checked })}
                />
                <span>Remember me</span>
              </label>
              <button type="button" className="auth-link">
                Forgot password?
              </button>
            </div>

            <button type="submit" className="auth-btn auth-btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>

            <p className="auth-footer-text">
              Don't have an account?{' '}
              <button
                type="button"
                className="auth-link"
                onClick={() => {
                  setActiveTab('register');
                  resetForms();
                }}
              >
                Register now
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="auth-form">
            <div className="auth-form-row">
              <div className="auth-form-group">
                <label htmlFor="register-firstName">
                  <User 

                  size={16} />
                  First Name
                </label>
                <input
                  type="text"
                  id="register-firstName"
                  value={registerData.firstName}
                  onChange={(e) => {
                    setRegisterData({ ...registerData, firstName: e.target.value });
                    
                    if (errors.firstName) setErrors({ ...errors, firstName: '' });
                  }}
                  placeholder="John"
                  disabled={loading}
                  
                  className={errors.firstName ? 'error' : ''}
                />
                {errors.

                firstName && <span className="auth-error">{errors.firstName}</span>}
              </div>

              <div className="auth-form-group">
                <label htmlFor="register-lastName">
                  <User 

                  size={16} />
                  Last Name
                </label>
                <input
                  type="text"
                  id="register-lastName"
                  value={registerData.lastName}
                  onChange={(e) => {
                    setRegisterData({ ...registerData, lastName: e.target.value });
                    
                    if (errors.lastName) setErrors({ ...errors, lastName: '' });
                  }}
                  placeholder="Doe"
                  disabled={loading}
                  
                  className={errors.lastName ? 'error' : ''}
                />
                {errors.

                lastName && <span className="auth-error">{errors.lastName}</span>}
              </div>
            </div>

            <div className="auth-form-group">
              <label htmlFor="register-email">
                <Mail 

                size={16} />
                Email Address
              </label>
              <input
                type="email"
                id="register-email"
                value={registerData.email}
                onChange={(e) => {
                  setRegisterData({ ...registerData, email: e.target.value });
                  
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                placeholder="you@example.com"
                disabled={loading}
                
                className={errors.email ? 'error' : ''}
              />
              {errors.

              email && <span className="auth-error">{errors.email}</span>}
            </div>

            <div className="auth-form-group">
              <label htmlFor="register-password">
                <Lock 

                size={16} />
                Password
              </label>
              <div className="auth-password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="register-password"
                  value={registerData.password}
                  onChange={(e) => {
                    setRegisterData({ ...registerData, password: e.target.value });
                    
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  placeholder="At least 8 characters"
                  disabled={loading}
                  
                  className={errors.password ? 'error' : ''}
                />
                <button
                  type="button"
                  className="auth-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff 

                  size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.

              password && <span className="auth-error">{errors.password}</span>}
            </div>

            <div className="auth-form-group">
              <label htmlFor="register-confirmPassword">
                <Lock 

                size={16} />
                Confirm Password
              </label>
              <div className="auth-password-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="register-confirmPassword"
                  value={registerData.confirmPassword}
                  onChange={(e) => {
                    setRegisterData({ ...registerData, confirmPassword: e.target.value });
                    
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                  }}
                  placeholder="Re-enter your password"
                  disabled={loading}
                  
                  className={errors.confirmPassword ? 'error' : ''}
                />
                <button
                  type="button"
                  className="auth-toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff 

                  size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.

              confirmPassword && <span className="auth-error">{errors.confirmPassword}</span>}
            </div>

            <div className="auth-form-group">
              <label className="auth-checkbox">
                <input
                  type="checkbox"
                  checked={registerData.agreeToTerms}
                  onChange={(e) => {
                    setRegisterData({ ...registerData, agreeToTerms: e.target.checked });
                    
                    if (errors.agreeToTerms) setErrors({ ...errors, agreeToTerms: '' });
                  }}
                />
                <span>
                  I agree to the{' '}
                  <button type="button" className="auth-link">
                    Terms & Conditions
                  </button>
                </span>
              </label>
              {errors.

              agreeToTerms && <span className="auth-error">{errors.agreeToTerms}</span>}
            </div>

            <button type="submit" className="auth-btn auth-btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>

            <p className="auth-footer-text">
              Already have an account?{' '}
              <button
                type="button"
                className="auth-link"
                onClick={() => {
                  setActiveTab('login');
                  resetForms();
                }}
              >
                Login here
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
