import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AdMobBanner, AdMobRewarded } from 'expo-ads-admob';

// Use Google's test Ad Unit ID for testing
const TEST_AD_UNIT_ID = 'ca-app-pub-3940256099942544/9214589741';

export const BannerAd = () => {
  return (
    <View style={styles.container}>
      <AdMobBanner
        bannerSize="banner"
        adUnitID={TEST_AD_UNIT_ID} // Test ID
        servePersonalizedAds={true}
        onDidFailToReceiveAdWithError={(error) => console.log('Banner Ad Error:', error)}
      />
    </View>
  );
};

export const showRewardedAd = async () => {
  try {
    await AdMobRewarded.setAdUnitID(TEST_AD_UNIT_ID); // Test ID
    await AdMobRewarded.requestAdAsync();
    await AdMobRewarded.showAdAsync();
    console.log('Rewarded Ad Shown');
    return true;
  } catch (error) {
    console.error('Error showing rewarded ad:', error);
    return false;
  }
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
});
