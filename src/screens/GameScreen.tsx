import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BannerAd } from '../components/Ads';

const games = [
  'PUBG Mobile',
  'Call of Duty Mobile',
  'Fortnite Mobile',
  'Apex Legends Mobile',
  'Free Fire',
];

export default function GameScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { device } = route.params;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.gameItem}
      onPress={() => navigation.navigate('Sensitivity', { device, game: item })}
    >
      <Text style={styles.gameText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={games}
        renderItem={renderItem}
        keyExtractor={item => item}
        style={styles.list}
      />
      <BannerAd />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    flex: 1,
  },
  gameItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 8,
    elevation: 2,
  },
  gameText: {
    fontSize: 16,
  },
});