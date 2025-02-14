import React, { createContext, useContext, useEffect } from 'react';
import * as AdMob from 'expo-ads-admob';

const AdMobContext = createContext(null);

export function AdMobProvider({ children }) {
  useEffect(() => {
    initializeAdMob();
  }, []);

  const initializeAdMob = async () => {
    try {
      await AdMob.initialize();
    } catch (error) {
      console.error('AdMob initialization failed:', error);
    }
  };

  return (
    <AdMobContext.Provider value={null}>
      {children}
    </AdMobContext.Provider>
  );
}

export const useAdMob = () => useContext(AdMobContext);