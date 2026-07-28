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
  const [farmTwin, setFarmTwin] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchFarmTwin = async (userId, token) => {
    try {
      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.30.88.42:5000/api';
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

  const loginFarmer = async (phone, password) => {
    try {
      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.30.88.42:5000/api';
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password, isRegistering: false })
      });
      
      const resData = await res.json();
      if (resData.status === 'success') {
        const token = resData.token;
        const profile = resData.user;
        
        setAuthToken(token);
        setFarmerProfileState(profile);
        
        await AsyncStorage.setItem('@farmer_token', token);
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

<<<<<<< HEAD
  const registerFarmer = async (phone, password, name) => {
=======
  const registerFarmer = async (phone, password, name, emailInput, locationData = {}) => {
>>>>>>> 913d4a08a4505b68cefc5f0faab1c47713518e8d
    try {
      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.30.88.42:5000/api';
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
<<<<<<< HEAD
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password, name, isRegistering: true })
=======
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
>>>>>>> 913d4a08a4505b68cefc5f0faab1c47713518e8d
      });
      
      const resData = await res.json();
      if (resData.status === 'success') {
        const token = resData.token;
        const profile = resData.user;
        
        setAuthToken(token);
        setFarmerProfileState(profile);
        
        await AsyncStorage.setItem('@farmer_token', token);
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
        const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.30.88.42:5000/api';
        
        const headers = { 'Content-Type': 'application/json' };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        fetch(`${API_URL}/auth/profile/${updatedProfile._id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(newProfile)
        }).then(res => res.json())
          .then(data => console.log('[DB Sync] Profile updated:', data.status))
          .catch(err => console.warn('[DB Sync] Offline fallback:', err.message));
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
        const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.30.88.42:5000/api';
        
        const headers = { 'Content-Type': 'application/json' };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        fetch(`${API_URL}/farm/twin/${profile._id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(updatedTwin)
        }).then(res => res.json())
          .then(data => console.log('[DB Sync] Farm Twin updated:', data.status))
          .catch(err => console.warn('[DB Sync] Farm Twin offline fallback:', err.message));
      }
    } catch (e) {
      console.error('Failed to save farm twin to AsyncStorage', e);
    }
  };

  const logoutFarmer = async () => {
    try {
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
