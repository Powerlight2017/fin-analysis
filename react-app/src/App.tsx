import React, { useEffect, useState } from 'react';
import LoginComponent from './components/login/login';
import FinAnalysisReport from './components/fin-analysis-report/fin-analysis-report';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar/nav-bar';
import apiClient from './services/apiClient';
import authService from './services/authService';
import './App.css';
import { AppDispatch, RootState } from './redux/store';
import {
  setLoading,
  setUser,
  setIsLoggedIn,
} from './redux/features/user/userSlice';
import ExpenseEditor from './components/expenses-editor/expenses-editor';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import toast, { Toaster } from 'react-hot-toast';

const App: React.FC = () => {

  const user = useAppSelector((state: RootState) => state.user.userInfo);
  const isLoggedIn = useAppSelector(
    (state: RootState) => state.user.isLoggedIn,
  );
  const loading = useAppSelector((state: RootState) => state.user.isLoading);
  const dispatch: AppDispatch = useAppDispatch();


  useEffect(() => {
    var token = localStorage.getItem('authToken');
    if (token) {
      apiClient.defaults.headers['Authorization'] = 'Bearer ' + token;
      dispatch(setIsLoggedIn(true));
    }

    apiClient.interceptors.request.use((config) => {
      dispatch(setLoading(true));
      return config;
    });

    apiClient.interceptors.response.use(
      (response) => {
        dispatch(setLoading(false));
        return response;
      },
      (error) => {
        dispatch(setLoading(false));
        if (error.response && error.response.status === 401) {
          authService.logout().finally(() => {
            dispatch(setIsLoggedIn(false));
          });
        }
        return Promise.reject(error);
      },
    );
  }, [dispatch]);

  return (
    <div className="container">
      <Toaster />
      {isLoggedIn ? (
        <Router>
          <div>
            <Navbar />
            <Routes>
              <Route path="/" element={<FinAnalysisReport />}></Route>
              <Route path="/edit-expenses" element={<ExpenseEditor />}></Route>
              <Route
                path="/about"
                element={<> Expenses demo application </>}
              ></Route>
            </Routes>
          </div>
        </Router>
      ) : (
        <LoginComponent />
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
