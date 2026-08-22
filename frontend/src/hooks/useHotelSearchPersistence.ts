import { useState, useEffect } from 'react';
import { City } from '../data/locationsData';

export interface HotelSearchState {
  destination: string;
  destinationId: string | number;
  checkIn: string; // ISO format YYYY-MM-DD
  checkOut: string; // ISO format YYYY-MM-DD
  rooms: number;
  guests: { adults: number; children: number };
  timestamp: number;
}

const STORAGE_KEY = 'm2n_hotel_search_state';
const EXPIRATION_TIME_MS = 15 * 24 * 60 * 60 * 1000; // 15 days

export const useHotelSearchPersistence = () => {
  const [initialSearchState, setInitialSearchState] = useState<HotelSearchState | null>(null);

  useEffect(() => {
    const savedState = getSavedSearchState();
    if (savedState) {
      setInitialSearchState(savedState);
    }
  }, []);

  const getSavedSearchState = (): HotelSearchState | null => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (!savedData) return null;

      const parsedData: HotelSearchState = JSON.parse(savedData);
      
      // 1. Expiration Logic (15-Day Rule)
      const now = Date.now();
      if (now - parsedData.timestamp > EXPIRATION_TIME_MS) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }

      // 2. Date Validation Logic
      const todayDate = new Date().toISOString().split('T')[0];
      if (parsedData.checkIn < todayDate) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }

      return parsedData;
    } catch (error) {
      console.error('Failed to parse saved search state from localStorage', error);
      // Clean up potentially corrupted data
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  };

  const saveSearchState = (data: Omit<HotelSearchState, 'timestamp'>) => {
    try {
      const payload: HotelSearchState = {
        ...data,
        timestamp: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (error) {
      console.error('Failed to save search state to localStorage', error);
    }
  };

  return { initialSearchState, saveSearchState, getSavedSearchState };
};
