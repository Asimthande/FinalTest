import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

export default function DealsScreen() {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecommendedHotels();
  }, []);

  const fetchRecommendedHotels = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://fakestoreapi.com/products');
      
      // Transform products into hotel-like data
      const hotelData = response.data.slice(0, 6).map((product, index) => ({
        id: product.id.toString(),
        name: product.title.length > 30 ? product.title.substring(0, 30) + '...' : product.title,
        location: ['Cape Town', 'Johannesburg', 'Durban', 'Pretoria', 'Port Elizabeth', 'Bloemfontein'][index],
        rating: (Math.random() * 1 + 4).toFixed(1), // Random rating between 4.0 and 5.0
        price: Math.round(product.price * 15), // Convert to ZAR
        image: product.image,
        description: product.description,
        category: 'Recommended'
      }));

      setProducts(hotelData);
      setError(null);
    } catch (err) {
      setError('Failed to load recommended hotels');
      console.error('API Error:', err);
      
      // Fallback data if API fails
      const fallbackData = [
        {
          id: '101',
          name: 'Luxury Beach Resort',
          location: 'Cape Town',
          rating: 4.8,
          price: 450,
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
          description: 'Premium beachfront accommodation',
          category: 'Recommended'
        },
        {
          id: '102',
          name: 'Mountain View Lodge',
          location: 'Drakensberg',
          rating: 4.6,
          price: 320,
          image: 'https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=400',
          description: 'Scenic mountain retreat',
          category: 'Recommended'
        },
        {
          id: '103',
          name: 'City Central Hotel',
          location: 'Johannesburg',
          rating: 4.3,
          price: 280,
          image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400',
          description: 'Modern hotel in business district',
          category: 'Recommended'
        }
      ];
      setProducts(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  const renderHotelCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.hotelCard}
      onPress={() => navigation.navigate('HotelDetails', { hotel: item })}
    >
      <Image source={{ uri: item.image }} style={styles.hotelImage} />
      <View style={styles.dealBadge}>
        <Ionicons name="flash" size={16} color="#ffffff" />
        <Text style={styles.dealText}>Deal</Text>
      </View>
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

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1a237e" />
        <Text style={styles.loadingText}>Loading recommended hotels...</Text>
      </View>
    );
  }

  if (error && products.length === 0) {
    return (
      <View style={styles.centered}>
        <Ionicons name="warning" size={50} color="#666666" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchRecommendedHotels}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recommended Hotels</Text>
        <Text style={styles.subtitle}>Special deals just for you</Text>
      </View>

      <FlatList
        data={products}
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 16,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  errorText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#1a237e',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
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
    overflow: 'hidden',
  },
  hotelImage: {
    width: '100%',
    height: 200,
  },
  dealBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  dealText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
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