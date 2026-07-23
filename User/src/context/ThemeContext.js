import React, { createContext, useContext } from 'react';

export const THEME = {
  primary: '#2E7D32',
  secondary: '#4CAF50',
  lightGreen: '#81C784',
  goldenCrop: '#F9A825',
  earthBrown: '#795548',
  bg: '#F7F9F4',
  deepForest: '#112211',
  olive: '#1b2e1b',
  glassBg: 'rgba(27, 46, 27, 0.06)',
  glassCard: 'rgba(255, 255, 255, 0.85)',
  glassBorder: 'rgba(76, 175, 80, 0.15)',
  textDark: '#112211',
  textMuted: '#5a6b5a'
};

const ThemeContext = createContext(THEME);

export const ThemeProvider = ({ children }) => {
  return (
    <ThemeContext.Provider value={THEME}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
