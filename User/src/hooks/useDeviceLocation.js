import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { API_BASE_URL } from '../config/api';

/**
 * useDeviceLocation - Real GPS Tracking Hook for ApnaKissan
 * 
 * On mount:
 *  1. Requests device GPS permission via expo-location.
 *  2. Captures real latitude & longitude from the device sensor.
 *  3. Reverse geocodes coordinates into Village, Mandal, District, State, Pincode
 *     via Backend /api/geocode (Nominatim).
 *  4. Optionally syncs location to MongoDB user profile.
 * 
 * Returns: { location, address, loading, error, refresh }
 */
export default function useDeviceLocation(userId = null, authToken = null) {
  const [location, setLocation] = useState(null);       // { latitude, longitude }
  const [address, setAddress] = useState(null);          // { village, mandal, district, state, pincode }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  const fetchLocation = async () => {
    try {
      setLoading(true);
      setError(null);

      // Step 1: Request GPS permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied. Please enable GPS in Settings.');
        setLoading(false);
        return;
      }

      // Step 2: Get real device GPS coordinates
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const coords = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      };

      if (isMounted.current) {
        setLocation(coords);
      }

      // Step 3: Reverse geocode via backend API (Nominatim)
      try {
        const geoRes = await fetch(
          `${API_BASE_URL}/geocode?latitude=${coords.latitude}&longitude=${coords.longitude}`
        );
        const geoData = await geoRes.json();

        if (geoData.status === 'success' && geoData.data) {
          const addr = geoData.data.address || {};
          const resolvedAddress = {
            village: addr.village || addr.suburb || addr.town || addr.city || '',
            mandal: addr.county || addr.state_district || '',
            district: addr.state_district || addr.city_district || addr.county || '',
            state: addr.state || '',
            pincode: addr.postcode || '',
            country: addr.country || 'India',
            displayName: geoData.data.display_name || '',
          };

          if (isMounted.current) {
            setAddress(resolvedAddress);
          }

          // Step 4: Sync location to MongoDB user profile
          if (userId && authToken) {
            fetch(`${API_BASE_URL}/auth/profile/${userId}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
              },
              body: JSON.stringify({
                gpsLocation: coords,
                village: resolvedAddress.village,
                mandal: resolvedAddress.mandal,
                district: resolvedAddress.district,
                state: resolvedAddress.state,
                pincode: resolvedAddress.pincode,
              }),
            })
              .then(r => r.json())
              .then(d => console.log('[GPS] Location synced to MongoDB:', d.status))
              .catch(e => console.warn('[GPS] Sync fallback:', e.message));
          }
        }
      } catch (geoErr) {
        console.warn('[GPS] Reverse geocode fallback:', geoErr.message);
      }
    } catch (err) {
      console.error('[GPS] Location error:', err.message);
      if (isMounted.current) {
        setError(err.message);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    isMounted.current = true;
    fetchLocation();
    return () => {
      isMounted.current = false;
    };
  }, []);

  return {
    location,      // { latitude, longitude } from device GPS
    address,       // { village, mandal, district, state, pincode }
    loading,
    error,
    refresh: fetchLocation,
  };
}
