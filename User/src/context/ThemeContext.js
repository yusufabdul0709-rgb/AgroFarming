import React, { createContext, useContext } from 'react';

export const THEME = {
  primary: '#2C6B43',         // Forest green (primary buttons/titles)
  secondary: '#556B2F',       // Olive green (highlights/secondary buttons)
  sage: '#8FBC8F',            // Sage green (success metrics/nutrient status)
  lightGreen: '#E1EBE4',      // Soft background green
  goldenCrop: '#EAA013',      // Gold/yellow crop rating and price spikes
  earthBrown: '#795548',      // Earthy brown timelines
  bg: '#F8FAF6',              // Soft beige/off-white background
  deepForest: '#1E4620',      // Deepest forest text headers
  textDark: '#222B24',        // Deep forest-tinted dark body text
  textMuted: '#5A6B5E',       // Sage-tinted muted supporting text
  glassCard: 'rgba(255, 255, 255, 0.92)',
  glassBorder: 'rgba(44, 107, 67, 0.08)' // 8% opacity primary green borders
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
