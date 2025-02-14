import React from 'react';
import { View } from 'react-native';
import { AdMobBanner, AdMobRewarded } from 'expo-ads-admob';

// Replace these with your actual AdMob IDs
const BANNER_ID = 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy';
const REWARDED_ID = 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy';

export const BannerAd = () => {
  return (
    <View style={{ alignItems: 'center' }}>
      <AdMobBanner
        bannerSize="banner"
        adUnitID={BANNER_ID}
        onDidFailToReceiveAdWithError={(error) => console.log(error)}
      />
    </View>
  );
};

export const showRewardedAd = async () => {
  try {
    await AdMobRewarded.setAdUnitID(REWARDED_ID);
    await AdMobRewarded.requestAdAsync();
    await AdMobRewarded.showAdAsync();
    return true;
  } catch (error) {
    console.error('Error showing rewarded ad:', error);
    return false;
  }
};