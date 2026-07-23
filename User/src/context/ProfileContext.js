import React, { createContext, useContext, useState } from 'react';

const ProfileContext = createContext(null);

export const ProfileProvider = ({ children }) => {
  const [farmerProfile, setFarmerProfile] = useState({
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
  });

  return (
    <ProfileContext.Provider value={{ farmerProfile, setFarmerProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
export default ProfileContext;
