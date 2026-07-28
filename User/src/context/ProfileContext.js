import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../config/supabaseClient.js';

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
  const [farmTwin, setFarmTwin] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Helper to fetch farm twin details
  const fetchFarmTwin = async (userId, token) => {
    try {
      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.30.88.39:5000/api';
      const res = await fetch(`${API_URL}/farm/twin/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.status === 'success') {
        setFarmTwin(data.farm);
        await AsyncStorage.setItem('@farmer_farm_twin', JSON.stringify(data.farm));
      }
    } catch (e) {
      console.warn('Offline fallback for farm twin fetch:', e.message);
      const storedFarm = await AsyncStorage.getItem('@farmer_farm_twin');
      if (storedFarm) {
        setFarmTwin(JSON.parse(storedFarm));
      }
    }
  };

  useEffect(() => {
    // Load profile and token from AsyncStorage on mount
    const loadProfile = async () => {
      try {
        const storedProfile = await AsyncStorage.getItem('@farmer_profile');
        const storedToken = await AsyncStorage.getItem('@farmer_token');
        const storedFarm = await AsyncStorage.getItem('@farmer_farm_twin');
        if (storedProfile) {
          const profile = JSON.parse(storedProfile);
          setFarmerProfileState(profile);
          if (storedToken && profile._id) {
            fetchFarmTwin(profile._id, storedToken);
          }
        }
        if (storedToken) {
          setAuthToken(storedToken);
        }
        if (storedFarm) {
          setFarmTwin(JSON.parse(storedFarm));
        }
      } catch (e) {
        console.error('Failed to load profile from AsyncStorage', e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadProfile();
  }, []);

  const loginFarmer = async (phoneOrEmail, password) => {
    try {
      const email = phoneOrEmail.includes('@') ? phoneOrEmail : `${phoneOrEmail}@gmail.com`;
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        return { success: false, message: error.message };
      }

      const token = data.session.access_token;
      setAuthToken(token);
      await AsyncStorage.setItem('@farmer_token', token);

      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.30.88.39:5000/api';
      const res = await fetch(`${API_URL}/auth/sync`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          phone: phoneOrEmail.includes('@') ? '' : phoneOrEmail,
          email: phoneOrEmail.includes('@') ? phoneOrEmail : ''
        })
      });
      
      const resData = await res.json();
      if (resData.status === 'success') {
        const profile = resData.user;
        setFarmerProfileState(profile);
        await AsyncStorage.setItem('@farmer_profile', JSON.stringify(profile));
        await fetchFarmTwin(profile._id, token);
        return { success: true };
      } else {
        return { success: false, message: resData.message };
      }
    } catch (e) {
      console.error('Login failed', e);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const registerFarmer = async (phone, password, name, emailInput, locationData = {}) => {
    try {
      const email = emailInput && emailInput.includes('@') ? emailInput : `${phone}@gmail.com`;
      const { data, error } = await supabase.auth.signUp({ email, password });
      
      if (error) {
        return { success: false, message: error.message };
      }

      let token = data.session?.access_token;

      if (!token) {
        const signInRes = await supabase.auth.signInWithPassword({ email, password });
        if (signInRes.error) {
          return { success: false, message: signInRes.error.message };
        }
        token = signInRes.data.session.access_token;
      }

      setAuthToken(token);
      await AsyncStorage.setItem('@farmer_token', token);

      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.30.88.39:5000/api';
      const res = await fetch(`${API_URL}/auth/sync`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          phone, 
          name, 
          preferredLanguage: 'English',
          gpsLocation: locationData.gpsLocation,
          village: locationData.village,
          district: locationData.district,
          state: locationData.state
        })
      });
      
      const resData = await res.json();
      if (resData.status === 'success') {
        const profile = resData.user;
        setFarmerProfileState(profile);
        await AsyncStorage.setItem('@farmer_profile', JSON.stringify(profile));
        await fetchFarmTwin(profile._id, token);
        return { success: true };
      } else {
        return { success: false, message: resData.message };
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
        const token = authToken || await AsyncStorage.getItem('@farmer_token');
        const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.30.88.39:5000/api';
        
        const headers = { 'Content-Type': 'application/json' };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        fetch(`${API_URL}/auth/profile/${updatedProfile._id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(newProfile)
        }).then(res => res.json())
          .then(data => console.log('[MySQL Sync] Profile updated:', data.status))
          .catch(err => console.warn('[MySQL Sync] Offline fallback:', err.message));
      }
    } catch (e) {
      console.error('Failed to save profile to AsyncStorage', e);
    }
  };

  const saveFarmTwin = async (updatedTwin) => {
    try {
      const mergedTwin = { ...farmTwin, ...updatedTwin };
      setFarmTwin(mergedTwin);
      await AsyncStorage.setItem('@farmer_farm_twin', JSON.stringify(mergedTwin));

      const profile = farmerProfile;
      if (profile && profile._id) {
        const token = authToken || await AsyncStorage.getItem('@farmer_token');
        const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.30.88.39:5000/api';
        
        const headers = { 'Content-Type': 'application/json' };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        fetch(`${API_URL}/farm/twin/${profile._id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(updatedTwin)
        }).then(res => res.json())
          .then(data => console.log('[MySQL Sync] Farm Twin updated:', data.status))
          .catch(err => console.warn('[MySQL Sync] Farm Twin offline fallback:', err.message));
      }
    } catch (e) {
      console.error('Failed to save farm twin to AsyncStorage', e);
    }
  };

  const logoutFarmer = async () => {
    try {
      await supabase.auth.signOut();
      setFarmerProfileState(DEFAULT_PROFILE);
      setFarmTwin(null);
      setAuthToken(null);
      await AsyncStorage.removeItem('@farmer_profile');
      await AsyncStorage.removeItem('@farmer_token');
      await AsyncStorage.removeItem('@farmer_farm_twin');
    } catch (e) {
      console.error('Logout failed', e);
    }
  };

  return (
    <ProfileContext.Provider value={{ 
      farmerProfile, 
      farmTwin,
      saveFarmerProfile, 
      saveFarmTwin,
      loginFarmer, 
      registerFarmer, 
      logoutFarmer, 
      isLoaded, 
      authToken 
    }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
export default ProfileContext;
