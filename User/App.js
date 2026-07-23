import React from 'react';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { ThemeProvider } from './src/context/ThemeContext';
import { ProfileProvider } from './src/context/ProfileContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <ThemeProvider>
      <ProfileProvider>
        <ExpoStatusBar style="dark" />
        <AppNavigator />
      </ProfileProvider>
    </ThemeProvider>
  );
}
