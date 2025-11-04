import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Use images from assets/Materials/06-Explore Page for the sample hotels
const hotelsData = [
  {
    id: '1',
    name: 'Ocean View Hotel',
    location: 'Cape Town, South Africa',
    rating: 4.8,
    price: 250,
    image: require('../assets/Materials/06-Explore Page/image-1.png'),
    description: 'Luxury beachfront hotel with stunning ocean views and premium amenities'
  },
  {
    id: '2',
    name: 'Mountain Retreat',
    location: 'Drakensberg, South Africa',
    rating: 4.6,
    price: 180,
    image: require('../assets/Materials/06-Explore Page/image-13.png'),
    description: 'Peaceful mountain getaway with spa facilities and nature trails'
  },
  {
    id: '3',
    name: 'City Center Suites',
    location: 'Johannesburg, South Africa',
    rating: 4.3,
    price: 120,
    image: require('../assets/Materials/06-Explore Page/image-14.png'),
    description: 'Modern suites in the heart of the city with business facilities'
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
      <View style={styles.imageContainer}>
        <Image 
          source={item.image} 
          style={styles.hotelImage}
          resizeMode="cover"
        />
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={12} color="#FFFFFF" />
          <Text style={styles.ratingBadgeText}>{item.rating}</Text>
        </View>
      </View>
      <View style={styles.hotelInfo}>
        <Text style={styles.hotelName}>{item.name}</Text>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color="#666666" />
          <Text style={styles.hotelLocation}>{item.location}</Text>
        </View>
        <View style={styles.amenitiesContainer}>
          <View style={styles.amenityTag}>
            <Ionicons name="wifi" size={12} color="#1a237e" />
            <Text style={styles.amenityText}>Free WiFi</Text>
          </View>
          <View style={styles.amenityTag}>
            <Ionicons name="restaurant" size={12} color="#1a237e" />
            <Text style={styles.amenityText}>Restaurant</Text>
          </View>
          <View style={styles.amenityTag}>
            <Text style={styles.amenityText}>Pool</Text>
          </View>
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
      {/* HEADER WITH EXPLORE ICON */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Ionicons name="search" size={28} color="#1a237e" style={styles.exploreIcon} />
          <View>
            <Text style={styles.title}>Find Your Perfect Stay</Text>
            <Text style={styles.subtitle}>Discover amazing hotels for your next adventure</Text>
          </View>
        </View>
        
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Sort by:</Text>
          <TouchableOpacity 
            style={[styles.filterButton, sortBy === 'price' && styles.filterButtonActive]}
            onPress={() => sortHotels('price')}
          >
            <Ionicons 
              name="pricetag" 
              size={14} 
              color={sortBy === 'price' ? '#ffffff' : '#666666'} 
              style={styles.filterIcon}
            />
            <Text style={[styles.filterText, sortBy === 'price' && styles.filterTextActive]}>
              Price
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, sortBy === 'rating' && styles.filterButtonActive]}
            onPress={() => sortHotels('rating')}
          >
            <Ionicons 
              name="star" 
              size={14} 
              color={sortBy === 'rating' ? '#ffffff' : '#666666'} 
              style={styles.filterIcon}
            />
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
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  exploreIcon: {
    marginRight: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  filterLabel: {
    fontSize: 14,
    color: '#666666',
    marginRight: 8,
    fontWeight: '500',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    gap: 6,
  },
  filterButtonActive: {
    backgroundColor: '#1a237e',
    borderColor: '#1a237e',
  },
  filterIcon: {
    marginRight: 4,
  },
  filterText: {
    color: '#666666',
    fontWeight: '500',
    fontSize: 14,
  },
  filterTextActive: {
    color: '#ffffff',
  },
  listContent: {
    paddingBottom: 20,
  },
  hotelCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  hotelImage: {
    width: '100%',
    height: 220,
    backgroundColor: '#f5f5f5',
  },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  ratingBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  hotelInfo: {
    padding: 20,
  },
  hotelName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  hotelLocation: {
    color: '#666666',
    marginLeft: 6,
    fontSize: 14,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  amenityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  amenityText: {
    fontSize: 11,
    color: '#666666',
    fontWeight: '500',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a237e',
  },
  night: {
    color: '#666666',
    fontSize: 14,
    marginLeft: 4,
  },
});