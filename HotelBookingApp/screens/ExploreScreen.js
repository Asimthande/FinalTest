import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const hotelsData = [
  {
    id: '1',
    name: 'Ocean View Hotel',
    location: 'Cape Town, South Africa',
    rating: 4.8,
    price: 250,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
    description: 'Luxury beachfront hotel with stunning ocean views'
  },
  {
    id: '2',
    name: 'Mountain Retreat',
    location: 'Drakensberg, South Africa',
    rating: 4.6,
    price: 180,
    image: 'https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=400',
    description: 'Peaceful mountain getaway with spa facilities'
  },
  {
    id: '3',
    name: 'City Center Suites',
    location: 'Johannesburg, South Africa',
    rating: 4.3,
    price: 120,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400',
    description: 'Modern suites in the heart of the city'
  },
];

export default function ExploreScreen() {
  const navigation = useNavigation();
  const [hotels, setHotels] = useState(hotelsData);
  const [sortBy, setSortBy] = useState('default');

  const sortHotels = (criteria) => {
    let sortedHotels = [...hotelsData];
    if (criteria === 'price') {
      sortedHotels.sort((a, b) => a.price - b.price);
    } else if (criteria === 'rating') {
      sortedHotels.sort((a, b) => b.rating - a.rating);
    }
    setHotels(sortedHotels);
    setSortBy(criteria);
  };

  const renderHotelCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.hotelCard}
      onPress={() => navigation.navigate('HotelDetails', { hotel: item })}
    >
      <Image source={{ uri: item.image }} style={styles.hotelImage} />
      <View style={styles.hotelInfo}>
        <Text style={styles.hotelName}>{item.name}</Text>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color="#666666" />
          <Text style={styles.hotelLocation}>{item.location}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFA000" />
          <Text style={styles.rating}>{item.rating}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>R{item.price}</Text>
          <Text style={styles.night}>/night</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Find Your Perfect Stay</Text>
        <View style={styles.filterContainer}>
          <TouchableOpacity 
            style={[styles.filterButton, sortBy === 'price' && styles.filterButtonActive]}
            onPress={() => sortHotels('price')}
          >
            <Text style={[styles.filterText, sortBy === 'price' && styles.filterTextActive]}>
              Price
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, sortBy === 'rating' && styles.filterButtonActive]}
            onPress={() => sortHotels('rating')}
          >
            <Text style={[styles.filterText, sortBy === 'rating' && styles.filterTextActive]}>
              Rating
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={hotels}
        renderItem={renderHotelCard}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
  },
  filterButtonActive: {
    backgroundColor: '#1a237e',
  },
  filterText: {
    color: '#666666',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  listContent: {
    paddingBottom: 20,
  },
  hotelCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hotelImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  hotelInfo: {
    padding: 16,
  },
  hotelName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  hotelLocation: {
    color: '#666666',
    marginLeft: 4,
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rating: {
    color: '#000000',
    marginLeft: 4,
    fontWeight: '500',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a237e',
  },
  night: {
    color: '#666666',
    marginLeft: 4,
  },
});