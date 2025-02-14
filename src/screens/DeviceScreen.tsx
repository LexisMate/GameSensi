import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BannerAd } from '../components/Ads';

const devices = [
  'iPhone 13 Pro',
  'iPhone 14 Pro Max',
  'Samsung Galaxy S21',
  'Samsung Galaxy S22 Ultra',
  'Google Pixel 6',
  'Google Pixel 7 Pro',
  'OnePlus 9 Pro',
  'Xiaomi Mi 11',
];

export default function DeviceScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  const filteredDevices = devices.filter(device =>
    device.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.deviceItem}
      onPress={() => navigation.navigate('Games', { device: item })}
    >
      <Text style={styles.deviceText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search devices..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredDevices}
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
  searchInput: {
    margin: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  list: {
    flex: 1,
  },
  deviceItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 8,
    elevation: 2,
  },
  deviceText: {
    fontSize: 16,
  },
});