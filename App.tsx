import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OpenScreen from './src/screens/OpenScreen';
import DeviceScreen from './src/screens/DeviceScreen';
import GameScreen from './src/screens/GameScreen';
import SensiScreen from './src/screens/SensiScreen';
import { BannerAd } from './src/components/Ads';
import { AdMobProvider } from './src/context/AdMobContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AdMobProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Open"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#1a1a1a',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="Open"
            component={OpenScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Devices"
            component={DeviceScreen}
            options={{ title: 'Select Device' }}
          />
          <Stack.Screen
            name="Games"
            component={GameScreen}
            options={{
              title: 'Select Game',
              headerRight: () => <BannerAd />,
            }}
          />
          <Stack.Screen
            name="Sensitivity"
            component={SensiScreen}
            options={{ title: 'Best Sensitivity' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AdMobProvider>
  );
}
