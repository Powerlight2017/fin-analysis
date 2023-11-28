import toast from 'react-hot-toast';
import {
  setError,
  setIsLoggedIn,
  setUser,
} from '../redux/features/user/userSlice';
import { AppDispatch } from '../redux/store';
import apiClient from '../services/apiClient';
import authService from '../services/authService';

export const handleLoginClick = async (
  dispatch: AppDispatch,
  username: string,
  password: string,
) => {
  try {
    const token = await authService.login(username, password);
    dispatch(setUser({ name: username }));
    dispatch(setIsLoggedIn(true));
  } catch (errorMessage) {
    setError(errorMessage.message);
    toast.error(errorMessage.message);
  }
};

export const handleLogout = (dispatch: AppDispatch) => {
  authService.logout().finally(() => {
    dispatch(setIsLoggedIn(false));
  });
};
