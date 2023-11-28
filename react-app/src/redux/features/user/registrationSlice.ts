import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../../types';
import apiClient from '../../../services/apiClient';

interface RegistrationState {
  error: string | null;
  isRegistered: boolean;
}

const initialState: RegistrationState = {
  error: null,
  isRegistered: false,
};

export const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setIsRegistered: (state, action: PayloadAction<boolean>) => {
      state.isRegistered = action.payload;
    },
  },
});

export const { setError, setIsRegistered } = registrationSlice.actions;

// Async thunk action
export const register =
  (username: string, password: string): AppThunk =>
  async (dispatch) => {
    try {
      const response = await apiClient.post('/api/auth/register', {
        username,
        password,
      });
      if (response.data.success) {
        dispatch(setIsRegistered(true));
      } else {
        dispatch(setError(response.data.message || 'Registration failed'));
      }
    } catch (error) {
      dispatch(
        setError('An error occurred while registering. Please try again.'),
      );
    }
  };

export default registrationSlice.reducer;
