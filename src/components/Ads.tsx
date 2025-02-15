import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AdMobBanner, AdMobRewarded } from 'expo-ads-admob';

const TEST_AD_UNIT_ID = 'ca-app-pub-3940256099942544/9214589741';

export const BannerAd = () => {
  const handleAdError = (error: any) => {
    console.error('Banner Ad Error:', error);
  };

  return (
    <View style={styles.container}>
      <AdMobBanner
        bannerSize="banner"
        adUnitID={TEST_AD_UNIT_ID} // Test Ad Unit
        servePersonalizedAds={true}
        onDidFailToReceiveAdWithError={handleAdError}
      />
    </View>
  );
};

export const showRewardedAd = async (): Promise<boolean> => {
  try {
    await AdMobRewarded.setAdUnitID(TEST_AD_UNIT_ID); // Test Ad Unit
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
