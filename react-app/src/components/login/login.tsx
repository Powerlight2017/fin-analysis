import React, { useEffect, useState } from 'react';
import './login.css'; // Импорт стилей
import apiClient from '../../services/apiClient';
import RegistrationComponent from '../registration/registration';
import authService from '../../services/authService';
import { ErrorMessage } from '@hookform/error-message';

interface LoginComponentProps {
  onLoginSuccess: () => void;
}

const LoginComponent: React.FC<LoginComponentProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [showRegister, setShowRegister] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      apiClient.defaults.headers['Authorization'] = 'Bearer ' + token;
    }
  }, []);

  const switchToRegister = async () => {
    setShowRegister(true);
  };

  const handleLoginClick = async () => {
    authService
      .login(username, password)
      .then(() => {
        onLoginSuccess();
      })
      .catch((errorMessage: string) => {
        setError(errorMessage);
      });
  };

  const handleRegisterSuccess = async () => {
    setShowRegister(false);
  };

  const handleBackToLogin = async () => {
    setShowRegister(false);
  };

  if (!showRegister) {
    return (
      <div className="login-container">
        <h2>Вход</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="email">Эл. почта:</label>
          <input
            type="email"
            id="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Пароль:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button onClick={handleLoginClick}>Login</button>
        <div className="register-link" onClick={switchToRegister}>
          Or Register new account
        </div>
      </div>
    );
  } else {
    return (
      <RegistrationComponent
        onRegisterSuccess={handleRegisterSuccess}
        onBackToLogin={handleBackToLogin}
      />
    );
  }
};

export default LoginComponent;
