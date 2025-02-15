import React, { createContext, useContext, useEffect } from 'react';
import * as AdMob from 'expo-ads-admob';

const AdMobContext = createContext(null);

export function AdMobProvider({ children }) {
  useEffect(() => {
    initializeAdMob();
  }, []);

  const initializeAdMob = async () => {
    try {
      await AdMob.setRequestConfiguration({
        testDeviceIdentifiers: [AdMob.simulatorId], // Ensure test devices are configured
      });
      await AdMob.initialize(); // Initialize AdMob
      console.log('AdMob Initialized');
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
