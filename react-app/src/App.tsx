import React, { useEffect, useState } from 'react';
import LoginComponent from './components/login/login';
import FinAnalysisReport from './components/fin-analysis-report/fin-analysis-report';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar/nav-bar';
import apiClient from './services/apiClient';
import authService from './services/authService';
import { ExpenseEditor } from './components/expenses-editor/expenses-editor';
import './App.css';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    authService.logout().finally(() => {
      setIsLoggedIn(false);
    });
  };

  const onLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    var token = localStorage.getItem('authToken');

    if (token) {
      // if token is exist set token for authentication
      apiClient.defaults.headers['Authorization'] = 'Bearer ' + token;
      setIsLoggedIn(true);
    }

    apiClient.interceptors.request.use((config) => {
      setLoading(true);
      return config;
    });

    apiClient.interceptors.response.use(
      (response) => {
        setLoading(false);
        return response;
      },
      (error) => {
        setLoading(false);
        switch (error.response.status) {
          case 401:
            authService.logout().finally(() => {
              setIsLoggedIn(false);
            });
            break;
        }

        return Promise.reject(error);
      },
    );
  }, []);

  return (
    <div className="container">
      {isLoggedIn ? (
        <Router>
          <div>
            <Navbar
              isLoggedIn={isLoggedIn}
              handleLogin={handleLogin}
              handleLogout={handleLogout}
            />
            <Routes>
              <Route path="/" element={<FinAnalysisReport />}></Route>
              <Route path="/edit-expenses" element={<ExpenseEditor />}></Route>
              <Route path="/about" element={<> Expenses demo application </>}></Route>
            </Routes>
          </div>
        </Router>
      ) : (
        <LoginComponent onLoginSuccess={onLoginSuccess} />
      )}

      <div>
        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
