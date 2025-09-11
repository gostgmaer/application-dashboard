import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Theme } from '@/types';

interface ThemeState {
  theme: Theme;
}

// Initialize theme from localStorage if available, otherwise default to 'system'
const getInitialTheme = (): Theme => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    return savedTheme || 'system';
  }
  return 'system';
};

const initialState: ThemeState = {
  theme: 'system', // Will be updated in the ThemeProvider component
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload);
      }
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;