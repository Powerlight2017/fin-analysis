import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  userInfo: { name: string } | null;
  isLoading: boolean;
  error: string | null;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  userInfo: null,
  isLoading: false,
  error: null,
  isLoggedIn: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ name: string }>) => {
      state.userInfo = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    setIsLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
  },
});

export const { setUser, setLoading, setError, setIsLoggedIn } =
  userSlice.actions;

export default userSlice.reducer;
