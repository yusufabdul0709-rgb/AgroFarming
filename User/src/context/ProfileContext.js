import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileContext = createContext(null);

const DEFAULT_PROFILE = {
  name: '',
  phone: '',
  village: '',
  district: '',
  state: '',
  landArea: '',
  landOwnership: 'Owned',
  soilType: 'Loamy',
  irrigationSource: 'Tube Well',
  waterAvailability: 'Moderate',
  annualIncome: '',
  category: 'OBC',
  currentCrops: ['Paddy'],
  previousCrops: ['Wheat'],
  farmingExperience: '',
  preferredLanguage: 'English',
  gpsLocation: { latitude: 28.6139, longitude: 77.2090 }
};

export const ProfileProvider = ({ children }) => {
  const [farmerProfile, setFarmerProfileState] = useState(DEFAULT_PROFILE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load profile from local storage on mount
    const loadProfile = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem('@farmer_profile');
        if (storedProfile) {
          setFarmerProfileState(JSON.parse(storedProfile));
        }
      } catch (e) {
        console.error('Failed to load profile from AsyncStorage', e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadProfile();
  }, []);

  const loginFarmer = async (phone, password) => {
    try {
      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.30.88.39:5000/api';
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password, isRegistering: false })
      });
      const data = await res.json();
      if (data.status === 'success') {
        const profile = data.user;
        setFarmerProfileState(profile);
        await AsyncStorage.setItem('@farmer_profile', JSON.stringify(profile));
        await AsyncStorage.setItem('@farmer_token', data.token);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (e) {
      console.error('Login failed', e);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const registerFarmer = async (phone, password, name) => {
    try {
      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.30.88.39:5000/api';
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password, name, isRegistering: true })
      });
      const data = await res.json();
      if (data.status === 'success') {
        const profile = data.user;
        setFarmerProfileState(profile);
        await AsyncStorage.setItem('@farmer_profile', JSON.stringify(profile));
        await AsyncStorage.setItem('@farmer_token', data.token);
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (e) {
      console.error('Registration failed', e);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const saveFarmerProfile = async (newProfile) => {
    try {
      const updatedProfile = { ...farmerProfile, ...newProfile };
      setFarmerProfileState(updatedProfile);
      await AsyncStorage.setItem('@farmer_profile', JSON.stringify(updatedProfile));

      if (updatedProfile._id) {
        // Sync to MongoDB Atlas cluster via Node.js Backend API
        const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.30.88.39:5000/api';
        fetch(`${API_URL}/auth/profile/${updatedProfile._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProfile)
        }).then(res => res.json())
          .then(data => console.log('[MongoDB Sync] Profile updated:', data.status))
          .catch(err => console.warn('[MongoDB Sync] Offline fallback:', err.message));
      }
    } catch (e) {
      console.error('Failed to save profile to AsyncStorage', e);
    }
  };

  return (
    <ProfileContext.Provider value={{ farmerProfile, saveFarmerProfile, loginFarmer, registerFarmer, isLoaded }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
export default ProfileContext;
