// @ts-nocheck
import React, { useState } from 'react';
import { X, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import './AuthModal.css';
import {resendVerificationEmail} from '../services/authService';
import { useLanguage } from '@/components/common/LanguageContext';

const AuthModal = ({ isOpen, onClose, defaultTab = 'login' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
   const { t } = useLanguage();
  const [successMessage, setSuccessMessage] = useState("");
  //const [activeTab, setActiveTab] = useState("login");
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
   console.log("REGISTER RESPONSE:", result);
  if (result.success) {
  console.log("SUCCESS BLOCK START");

  setSuccessMessage("Registration successful — verification required");
  console.log("setSuccessMessage:", setSuccessMessage);

  setActiveTab("verify");   //  THE IMPORTANT FIX
  console.log("setActiveTab:", setActiveTab);

  resetForms();
  console.log("resetForms:", resetForms);

  console.log("SUCCESS BLOCK END");
  return;
} else {
      setErrors({ submit: result.message || 'Registration failed. Please try again.' });
    }
  } catch (error) {
    setErrors({ submit: 'An error occurred. Please try again.' });
  } finally {
    setLoading(false);
  }
}

const handleResendEmail = async () => {
  try {
    const res = await resendVerificationEmail(registerData.email);
    setSuccessMessage("A new verification email has been sent.");
  } catch (err) {
    console.error("Resend email failed:", err);
    setErrors({ resend: "Failed to resend verification email." });
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
          <h2>{activeTab === 'login'
             ? t("authLogin.welcomeBack") 
             : t("authRegister.createAccount")}</h2>
          <p>
            {activeTab === 'login' 
              ? t("authLogin.loginToAccess")
              : t("authRegister.joinInvestment")}
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
             {t("nav.login")}
          </button>
          <button
            className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('register');
              resetForms();
            }}
          >
             {t("nav.register")}
          </button>
        </div>

        {errors.

        submit && (
          <div className="auth-alert auth-alert-error">
            {errors.

            submit}
          </div>
        )}

    {/*  ADD THIS NEW BLOCK BELOW THE TWO FORMS  */}
{activeTab === 'verify' && (
  <div className="auth-verify-container">
    <h2 className="auth-verify-title">Check your email</h2>

    <p className="auth-verify-description">
      We’ve sent you a verification link. Please verify your email before logging in.
    </p>

    {successMessage && (
      <div className="auth-alert auth-alert-success">
        {successMessage}
      </div>
    )}

    <button type="button" onClick={handleResendEmail} className="auth-link">
      Resend verification email
    </button>

    <button
      type="button"
      className="auth-btn auth-btn-primary mt-4"
      onClick={() => setActiveTab('login')}
    >
      Back to Login
    </button>
  </div>
)}
        {activeTab === 'login' ? (
         <form onSubmit={handleLoginSubmit} className="auth-form">
  {/* Email */}
  <div className="auth-form-group">
    <label htmlFor="login-email">
      <Mail size={16} />
      {t("authLogin.email")}
    </label>

    <input
      type="email"
      id="login-email"
      value={loginData.email}
      onChange={(e) => {
        setLoginData({ ...loginData, email: e.target.value });
        if (errors.email) setErrors({ ...errors, email: "" });
      }}
      placeholder="you@example.com"
      disabled={loading}
      className={errors.email ? "error" : ""}
    />

    {errors.email && (
      <span className="auth-error">{errors.email}</span>
    )}
  </div>

  {/* Password */}
  <div className="auth-form-group">
    <label htmlFor="login-password">
      <Lock size={16} />
      {t("authLogin.password")}
    </label>

    <div className="auth-password-wrapper">
      <input
        type={showPassword ? "text" : "password"}
        id="login-password"
        value={loginData.password}
        onChange={(e) => {
          setLoginData({ ...loginData, password: e.target.value });
          if (errors.password) setErrors({ ...errors, password: "" });
        }}
        placeholder={t("authLogin.passwordPlaceholder")}
        disabled={loading}
        className={errors.password ? "error" : ""}
      />

      <button
        type="button"
        className="auth-toggle-password"
        onClick={() => setShowPassword(!showPassword)}
        aria-label={showPassword ? t("authLogin.hidePassword") : t("authLogin.showPassword")}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>

    {errors.password && (
      <span className="auth-error">{errors.password}</span>
    )}
  </div>

  {/* Remember me + Forgot password */}
  <div className="auth-form-options">
    <label className="auth-checkbox">
      <input
        type="checkbox"
        checked={loginData.rememberMe}
        onChange={(e) =>
          setLoginData({ ...loginData, rememberMe: e.target.checked })
        }
      />
      <span>{t("authLogin.rememberMe")}</span>
    </label>

    <button type="button" className="auth-link">
      {t("authLogin.forgotPassword")}
    </button>
  </div>

  {/* Submit button */}
  <button type="submit" className="auth-btn auth-btn-primary" disabled={loading}>
    {loading ? (
      <>
        <span className="spinner"></span>
        {t("authLogin.loggingIn")}
      </>
    ) : (
      t("authLogin.loginBtn")
    )}
  </button>

  {/* Footer */}
  <p className="auth-footer-text">
    {t("authLogin.dontHaveAccount")}{" "}
    <button
      type="button"
      className="auth-link"
      onClick={() => {
        setActiveTab("register");
        resetForms();
      }}
    >
      {t("authLogin.registerNow")}
    </button>
  </p>
</form>
        ) : (
        <form onSubmit={handleRegisterSubmit} className="auth-form">

  {/* FIRST + LAST NAME */}
  <div className="auth-form-row">
    {/* First Name */}
    <div className="auth-form-group">
      <label htmlFor="register-firstName">
        <User size={16} />
        {t("authRegister.firstName")}
      </label>
      <input
        type="text"
        id="register-firstName"
        value={registerData.firstName}
        onChange={(e) => {
          setRegisterData({ ...registerData, firstName: e.target.value });
          if (errors.firstName) setErrors({ ...errors, firstName: "" });
        }}
        placeholder={t("authRegister.firstNamePlaceholder")}
        disabled={loading}
        className={errors.firstName ? "error" : ""}
      />
      {errors.firstName && (
        <span className="auth-error">{errors.firstName}</span>
      )}
    </div>

    {/* Last Name */}
    <div className="auth-form-group">
      <label htmlFor="register-lastName">
        <User size={16} />
        {t("authRegister.lastName")}
      </label>
      <input
        type="text"
        id="register-lastName"
        value={registerData.lastName}
        onChange={(e) => {
          setRegisterData({ ...registerData, lastName: e.target.value });
          if (errors.lastName) setErrors({ ...errors, lastName: "" });
        }}
        placeholder={t("authRegister.lastNamePlaceholder")}
        disabled={loading}
        className={errors.lastName ? "error" : ""}
      />
      {errors.lastName && (
        <span className="auth-error">{errors.lastName}</span>
      )}
    </div>
  </div>

  {/* Email */}
  <div className="auth-form-group">
    <label htmlFor="register-email">
      <Mail size={16} />
      {t("authRegister.email")}
    </label>
    <input
      type="email"
      id="register-email"
      value={registerData.email}
      onChange={(e) => {
        setRegisterData({ ...registerData, email: e.target.value });
        if (errors.email) setErrors({ ...errors, email: "" });
      }}
      placeholder="you@example.com"
      disabled={loading}
      className={errors.email ? "error" : ""}
    />
    {errors.email && (
      <span className="auth-error">{errors.email}</span>
    )}
  </div>

  {/* Password */}
  <div className="auth-form-group">
    <label htmlFor="register-password">
      <Lock size={16} />
      {t("authRegister.password")}
    </label>

    <div className="auth-password-wrapper">
      <input
        type={showPassword ? "text" : "password"}
        id="register-password"
        value={registerData.password}
        onChange={(e) => {
          setRegisterData({ ...registerData, password: e.target.value });
          if (errors.password) setErrors({ ...errors, password: "" });
        }}
        placeholder={t("authRegister.passwordPlaceholder")}
        disabled={loading}
        className={errors.password ? "error" : ""}
      />

      <button
        type="button"
        className="auth-toggle-password"
        onClick={() => setShowPassword(!showPassword)}
        aria-label={
          showPassword
            ? t("authRegister.hidePassword")
            : t("authRegister.showPassword")
        }
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>

    {errors.password && (
      <span className="auth-error">{errors.password}</span>
    )}
  </div>

  {/* Confirm Password */}
  <div className="auth-form-group">
    <label htmlFor="register-confirmPassword">
      <Lock size={16} />
      {t("authRegister.confirmPassword")}
    </label>

    <div className="auth-password-wrapper">
      <input
        type={showConfirmPassword ? "text" : "password"}
        id="register-confirmPassword"
        value={registerData.confirmPassword}
        onChange={(e) => {
          setRegisterData({ ...registerData, confirmPassword: e.target.value });
          if (errors.confirmPassword)
            setErrors({ ...errors, confirmPassword: "" });
        }}
        placeholder={t("authRegister.confirmPasswordPlaceholder")}
        disabled={loading}
        className={errors.confirmPassword ? "error" : ""}
      />

      <button
        type="button"
        className="auth-toggle-password"
        onClick={() =>
          setShowConfirmPassword(!showConfirmPassword)
        }
        aria-label={
          showConfirmPassword
            ? t("authRegister.hidePassword")
            : t("authRegister.showPassword")
        }
      >
        {showConfirmPassword ? (
          <EyeOff size={20} />
        ) : (
          <Eye size={20} />
        )}
      </button>
    </div>

    {errors.confirmPassword && (
      <span className="auth-error">{errors.confirmPassword}</span>
    )}
  </div>

  {/* Terms & Conditions */}
  <div className="auth-form-group">
    <label className="auth-checkbox">
      <input
        type="checkbox"
        checked={registerData.agreeToTerms}
        onChange={(e) => {
          setRegisterData({ ...registerData, agreeToTerms: e.target.checked });
          if (errors.agreeToTerms)
            setErrors({ ...errors, agreeToTerms: "" });
        }}
      />
      <span> 
        {t("authRegister.agreeTerms")}{" "}
        <button type="button" className="auth-link">
          {t("authRegister.termsConditions")}
        </button>
      </span>
    </label>
    {errors.agreeToTerms && (
      <span className="auth-error">{errors.agreeToTerms}</span>
    )}
  </div>

  {/* Submit button */}
  <button type="submit" className="auth-btn auth-btn-primary" disabled={loading}>
    {loading ? (
      <>
        <span className="spinner"></span>
        {t("authRegister.createBtn")}
      </>
    ) : (
      t("authRegister.createAccount")
    )}
  </button>

  {/* Footer */}
  <p className="auth-footer-text">
    {t("authRegister.haveAlradyCount")}{" "}
    <button
      type="button"
      className="auth-link"
      onClick={() => {
        setActiveTab("login");
        resetForms();
      }}
    >
      {t("authRegister.loginHere")}
    </button>
  </p>
</form>

        )}
    
      </div>
    </div>
  );
};

export default AuthModal;
