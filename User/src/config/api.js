import { Platform } from 'react-native';

// In development, Android emulator connects to host via 10.0.2.2, iOS via localhost
const LOCAL_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || `http://${LOCAL_HOST}:5000/api`;
export const PYTHON_AI_BASE_URL = process.env.EXPO_PUBLIC_PYTHON_API_URL || `http://${LOCAL_HOST}:8000/api/ai`;

/**
 * Universal fetch wrapper for ApnaKissan API
 */
export async function apiRequest(endpoint, options = {}) {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    const config = {
      ...options,
      headers,
    };
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`[API Client Error] ${endpoint}:`, error.message);
    throw error;
  }
}
