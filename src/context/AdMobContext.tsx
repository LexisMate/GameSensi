import React, { createContext, useContext, useEffect } from 'react';
import * as AdMob from 'expo-ads-admob';

type AdMobContextType = {
  initializeAdMob: () => Promise<void>;
};

const AdMobContext = createContext<AdMobContextType | null>(null);

export function AdMobProvider({ children }: { children: React.ReactNode }) {
  const initializeAdMob = async () => {
    try {
      await AdMob.setRequestConfiguration({
        testDeviceIdentifiers: [AdMob.simulatorId], // Ensure test devices are configured
      });
      console.log('AdMob Request Configuration Set');
      await AdMob.initialize(); // Initialize AdMob
      console.log('AdMob Initialized');
    } catch (error) {
      console.error('AdMob initialization failed:', error);
    }
  };

  useEffect(() => {
    initializeAdMob();
  }, []);

  return (
    <AdMobContext.Provider value={{ initializeAdMob }}>
      {children}
    </AdMobContext.Provider>
  );
}

export const useAdMob = () => {
  const context = useContext(AdMobContext);
  if (!context) {
    throw new Error('useAdMob must be used within an AdMobProvider');
  }
  return context;
};
