import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  Linking,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import * as Sharing from 'expo-sharing';
import { BannerAd, showRewardedAd } from '../components/Ads';

const PREMIUM_PRICE = '₹40';
const API_BASE_URL = 'https://api.izumie.me';

export default function SensiScreen() {
  const route = useRoute();
  const { device, game } = route.params;
  const [sensitivity, setSensitivity] = useState(null);
  const [premiumData, setPremiumData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const initUser = async () => {
      let id = await SecureStore.getItemAsync('userId');
      if (!id) {
        id = Math.random().toString(36).substring(7);
        await SecureStore.setItemAsync('userId', id);
      }
      setUserId(id);
      checkPremiumStatus(id);
    };

    initUser();
    fetchSensitivity();
  }, []);

  const checkPremiumStatus = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/premium/status?userId=${id}`);
      const data = await response.json();
      setIsPremium(data.isPremium);
      if (data.isPremium) {
        fetchPremiumData(id);
      }
    } catch (error) {
      console.error('Error checking premium status:', error);
    }
  };

  const fetchSensitivity = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/sensi/${encodeURIComponent(device)}/${encodeURIComponent(game)}`
      );
      const data = await response.json();
      setSensitivity(data);
      setLoading(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch sensitivity data');
      setLoading(false);
    }
  };

  const fetchPremiumData = async (id) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/sensi/${encodeURIComponent(device)}/${encodeURIComponent(game)}/premium?userId=${id}`
      );
      const data = await response.json();
      setPremiumData(data);
    } catch (error) {
      console.error('Error fetching premium data:', error);
    }
  };

  const handlePremiumPurchase = async () => {
    try {
      // In a real app, integrate with a payment gateway here
      const response = await fetch(`${API_BASE_URL}/premium/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          paymentId: 'demo_payment_' + Date.now(),
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsPremium(true);
        fetchPremiumData(userId);
        Alert.alert('Success', 'Premium features activated!');
        setShowPremiumModal(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process payment');
    }
  };

  const saveSensitivity = async () => {
    try {
      const result = await showRewardedAd();
      if (result) {
        const key = `${device}-${game}`;
        await SecureStore.setItemAsync(key, JSON.stringify(sensitivity));
        Alert.alert('Success', 'Settings saved successfully!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  const shareSensitivity = async () => {
    try {
      const message = `My ${game} sensitivity settings for ${device}:\n${JSON.stringify(sensitivity, null, 2)}`;
      await Sharing.shareAsync(message);
    } catch (error) {
      Alert.alert('Error', 'Failed to share settings');
    }
  };

  const submitFeedback = () => {
    Alert.alert(
      'Feedback',
      'How would you rate these sensitivity settings?',
      [
        { text: '👎 Poor', onPress: () => sendFeedback('poor') },
        { text: '👍 Good', onPress: () => sendFeedback('good') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const sendFeedback = async (rating) => {
    try {
      await fetch(`${API_BASE_URL}/sensi/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          device,
          game,
          rating,
          userId,
        }),
      });
      Alert.alert('Thank you!', 'Your feedback has been submitted.');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit feedback');
    }
  };

  const PremiumModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showPremiumModal}
      onRequestClose={() => setShowPremiumModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Upgrade to Premium</Text>
          <Text style={styles.modalPrice}>{PREMIUM_PRICE}</Text>
          
          <Text style={styles.featuresTitle}>Premium Features:</Text>
          <View style={styles.featuresList}>
            <Text style={styles.feature}>• Pro sensitivity tips</Text>
            <Text style={styles.feature}>• Custom layout recommendations</Text>
            <Text style={styles.feature}>• Advanced statistics</Text>
            <Text style={styles.feature}>• Priority support</Text>
          </View>

          <TouchableOpacity
            style={styles.purchaseButton}
            onPress={handlePremiumPurchase}
          >
            <Text style={styles.purchaseButtonText}>Purchase Now</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowPremiumModal(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Best Sensitivity Settings</Text>
        <Text style={styles.subtitle}>{device} - {game}</Text>
        
        {sensitivity && Object.entries(sensitivity).map(([key, value]) => (
          <View key={key} style={styles.settingItem}>
            <Text style={styles.settingLabel}>{key}:</Text>
            <Text style={styles.settingValue}>{value}</Text>
          </View>
        ))}

        {isPremium && premiumData && (
          <>
            <Text style={styles.sectionTitle}>Pro Tips</Text>
            {premiumData.ProTips?.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}

            <Text style={styles.sectionTitle}>Recommended Layouts</Text>
            {Object.entries(premiumData.RecommendedLayouts || {}).map(([layout, coords]) => (
              <View key={layout} style={styles.layoutItem}>
                <Text style={styles.layoutName}>{layout}</Text>
                <Text style={styles.layoutCoords}>
                  X: {coords.x}, Y: {coords.y}
                </Text>
              </View>
            ))}
          </>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={saveSensitivity}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={shareSensitivity}>
            <Text style={styles.buttonText}>Share</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={submitFeedback}>
            <Text style={styles.buttonText}>Feedback</Text>
          </TouchableOpacity>
        </View>

        {!isPremium && (
          <TouchableOpacity
            style={styles.premiumButton}
            onPress={() => setShowPremiumModal(true)}
          >
            <Text style={styles.premiumButtonText}>
              Upgrade to Premium - {PREMIUM_PRICE}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      <PremiumModal />
      <BannerAd />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingValue: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  premiumButton: {
    backgroundColor: '#FFD700',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  premiumButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    width: '90%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalPrice: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  featuresList: {
    alignSelf: 'stretch',
    marginBottom: 20,
  },
  feature: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  purchaseButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 10,
  },
  purchaseButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    color: '#666',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  tipItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  tipText: {
    fontSize: 16,
    color: '#333',
  },
  layoutItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  layoutName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  layoutCoords: {
    fontSize: 14,
    color: '#666',
  },
});