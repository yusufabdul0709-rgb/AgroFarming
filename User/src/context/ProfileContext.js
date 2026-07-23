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

  const saveFarmerProfile = async (newProfile) => {
    try {
      const updatedProfile = { ...farmerProfile, ...newProfile };
      setFarmerProfileState(updatedProfile);
      await AsyncStorage.setItem('@farmer_profile', JSON.stringify(updatedProfile));

      // Sync to MongoDB Atlas cluster via Node.js Backend API
      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.30.88.52:5000/api';
      fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: updatedProfile.phone || '9876543210',
          name: updatedProfile.name || 'Ramesh Kumar',
          preferredLanguage: updatedProfile.preferredLanguage || 'English',
          village: updatedProfile.village || 'Rajapur',
          landArea: parseFloat(updatedProfile.acres || updatedProfile.landArea || 15.4),
        })
      }).then(res => res.json())
        .then(data => console.log('[MongoDB Sync] Profile saved to MongoDB Atlas:', data.status))
        .catch(err => console.warn('[MongoDB Sync] Offline fallback:', err.message));
    } catch (e) {
      console.error('Failed to save profile to AsyncStorage', e);
    }
  };

  return (
    <ProfileContext.Provider value={{ farmerProfile, saveFarmerProfile, isLoaded }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
export default ProfileContext;
