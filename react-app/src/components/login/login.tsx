import React, { useState } from 'react';
import './login.css'; // Import styles.
import apiClient from '../../services/apiClient';
import RegistrationComponent from '../registration/registration';
import authService from '../../services/authService';
import { setUser, setIsLoggedIn } from '../../redux/features/user/userSlice';
import { useAppDispatch } from '../../redux/hooks';
import toast from 'react-hot-toast';
import { handleLoginClick } from '../../handlers/authHandlers';

const LoginComponent: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showRegister, setShowRegister] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const handleRegisterSuccess = () => {
    setShowRegister(false);
  };

  const switchToRegister = () => {
    setShowRegister(true);
  };

  const handleBackToLogin = () => {
    setShowRegister(false);
  };

  if (showRegister) {
    return (
      <RegistrationComponent
        onRegisterSuccess={handleRegisterSuccess}
        onBackToLogin={handleBackToLogin}
      />
    );
  }

  return (
    <div className="login-container">
      <h2>Login</h2>
      <div className="form-group">
        <label htmlFor="email">E-mail:</label>
        <input
          type="email"
          id="email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button onClick={() => handleLoginClick(dispatch, username, password)}>
        Login
      </button>
      <div className="register-link" onClick={switchToRegister}>
        Or Register new account
      </div>
    </div>
  );
};

export default LoginComponent;
