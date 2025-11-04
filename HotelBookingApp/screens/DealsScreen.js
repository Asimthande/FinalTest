import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

// Pre-loaded high quality images with better caching
const highQualityImages = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1586375300773-8384e3e4916f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1535827841776-24afc1e255ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80'
];

// Pre-load images to cache them
const preloadImages = () => {
  highQualityImages.forEach(src => {
    Image.prefetch(src).catch(() => console.log('Prefetch failed for:', src));
  });
};

export default function DealsScreen() {
  const navigation = useNavigation();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const imageLoadedRef = useRef({});

  useEffect(() => {
    preloadImages(); // Pre-load images when component mounts
    fetchRecommendedHotels();
  }, []);

  const fetchRecommendedHotels = async () => {
    try {
      setLoading(true);
      
      // Using Free Fake Hotel API
      const response = await axios.get('https://freetestapi.com/api/v1/hotels');
      
      // Transform API data to match our app structure
      const hotelData = response.data.slice(0, 6).map((hotel, index) => ({
        id: hotel.id?.toString() || index.toString(),
        name: hotel.name || `Luxury Hotel ${index + 1}`,
        location: hotel.city || hotel.country || 'Premium Location',
        rating: parseFloat((Math.random() * 1 + 4).toFixed(1)),
        price: Math.round((hotel.price || Math.random() * 200 + 100)),
        image: highQualityImages[index] || highQualityImages[0],
        description: hotel.description || `Premium hotel located in ${hotel.city || 'a prime location'} with excellent amenities and world-class services.`,
        amenities: hotel.amenities || ['Free WiFi', 'Swimming Pool', 'Restaurant', 'Spa', 'Gym', 'Bar']
      }));

      setHotels(hotelData);
      setError(null);
    } catch (err) {
      console.log('API Error, using fallback data:', err.message);
      setError('Unable to load hotels at the moment');
      useFallbackHotels();
    } finally {
      setLoading(false);
    }
  };

  const useFallbackHotels = () => {
    const fallbackHotels = [
      {
        id: '1',
        name: 'Table Bay Luxury Hotel',
        location: 'Cape Town, South Africa',
        rating: 4.8,
        price: 450,
        image: highQualityImages[0],
        description: '5-star luxury hotel with stunning Table Mountain and ocean views',
        amenities: ['Ocean View', 'Luxury Spa', 'Fine Dining', 'Infinity Pool', 'Concierge']
      },
      {
        id: '2',
        name: 'Drakensberg Mountain Resort',
        location: 'Drakensberg, South Africa',
        rating: 4.6,
        price: 320,
        image: highQualityImages[1],
        description: 'Premium mountain retreat with breathtaking views and exclusive hiking trails',
        amenities: ['Mountain View', 'Hiking Guides', 'Luxury Spa', 'Gourmet Restaurant', 'Fireplace']
      },
      {
        id: '3',
        name: 'Sandton Executive Hotel',
        location: 'Johannesburg, South Africa',
        rating: 4.4,
        price: 380,
        image: highQualityImages[2],
        description: 'Modern executive hotel in the heart of Sandton business district',
        amenities: ['City View', 'Business Center', 'Fitness Center', 'Rooftop Bar', 'Conference Rooms']
      },
      {
        id: '4',
        name: 'Durban Beachfront Resort',
        location: 'Durban, South Africa',
        rating: 4.7,
        price: 290,
        image: highQualityImages[3],
        description: 'Luxury beachfront resort with private beach access and tropical gardens',
        amenities: ['Private Beach', 'Infinity Pool', 'Beach Bar', 'Water Sports', 'Kids Club']
      },
      {
        id: '5',
        name: 'Wine Valley Luxury Estate',
        location: 'Stellenbosch, South Africa',
        rating: 4.9,
        price: 520,
        image: highQualityImages[4],
        description: 'Exclusive wine estate with vineyard views and premium wine tasting experiences',
        amenities: ['Vineyard View', 'Wine Tasting', 'Luxury Spa', 'Fine Dining', 'Wine Cellar']
      },
      {
        id: '6',
        name: 'Safari Luxury Lodge',
        location: 'Kruger National Park, South Africa',
        rating: 4.8,
        price: 680,
        image: highQualityImages[5],
        description: 'Exclusive safari lodge with private game drives and luxury bush experiences',
        amenities: ['Game Drives', 'Bush Pool', 'Private Chef', 'Spa', 'Sundowner Deck']
      }
    ];
    setHotels(fallbackHotels);
  };

  const handleImageLoad = (hotelId) => {
    imageLoadedRef.current[hotelId] = true;
  };

  const HotelImage = ({ hotel, style }) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(!imageLoadedRef.current[hotel.id]);

    return (
      <View style={style}>
        {imageLoading && !imageError && (
          <View style={styles.imagePlaceholder}>
            <ActivityIndicator size="small" color="#1a237e" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        )}
        <Image 
          source={{ uri: hotel.image }} 
          style={[
            styles.hotelImage,
            imageLoading && styles.hiddenImage
          ]}
          resizeMode="cover"
          onLoad={() => {
            setImageLoading(false);
            handleImageLoad(hotel.id);
          }}
          onLoadStart={() => {
            if (!imageLoadedRef.current[hotel.id]) {
              setImageLoading(true);
            }
          }}
          onError={() => {
            setImageError(true);
            setImageLoading(false);
          }}
        />
        {imageError && (
          <View style={styles.imageError}>
            <Ionicons name="image-outline" size={40} color="#cccccc" />
            <Text style={styles.errorText}>Image not available</Text>
          </View>
        )}
      </View>
    );
  };

  const renderHotelCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.hotelCard}
      onPress={() => navigation.navigate('HotelDetails', { hotel: item })}
    >
      <View style={styles.imageContainer}>
        <HotelImage hotel={item} style={styles.imageWrapper} />
        <View style={styles.dealBadge}>
          <Ionicons name="flash" size={16} color="#ffffff" />
          <Text style={styles.dealText}>Premium Deal</Text>
        </View>
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
          {item.amenities?.slice(0, 3).map((amenity, index) => (
            <View key={index} style={styles.amenityTag}>
              <Ionicons name="checkmark" size={10} color="#4CAF50" />
              <Text style={styles.amenityText}>{amenity}</Text>
            </View>
          ))}
          {item.amenities?.length > 3 && (
            <View style={styles.amenityTag}>
              <Text style={styles.amenityText}>+{item.amenities.length - 3} more</Text>
            </View>
          )}
        </View>
        
        <View style={styles.priceContainer}>
          <View>
            <Text style={styles.originalPrice}>R{item.price + 50}</Text>
            <Text style={styles.price}>R{item.price}</Text>
            <Text style={styles.night}>/night</Text>
          </View>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>SAVE 15%</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1a237e" />
        <Text style={styles.loadingText}>Loading premium hotels...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Premium Hotel Deals</Text>
        <Text style={styles.subtitle}>Luxury accommodations at exclusive prices</Text>
        <View style={styles.dealInfo}>
          <Ionicons name="shield-checkmark" size={16} color="#4CAF50" />
          <Text style={styles.dealInfoText}>Free cancellation • Best price guarantee</Text>
        </View>
      </View>

      <FlatList
        data={hotels}
        renderItem={renderHotelCard}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        initialNumToRender={3} // Render fewer items initially
        maxToRenderPerBatch={3} // Reduce batch size
        windowSize={5} // Reduce window size
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 12,
  },
  dealInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8f0',
    padding: 12,
    borderRadius: 8,
  },
  dealInfoText: {
    fontSize: 14,
    color: '#2E7D32',
    marginLeft: 8,
    fontWeight: '500',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
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
  imageWrapper: {
    height: 220,
    backgroundColor: '#f5f5f5',
  },
  hotelImage: {
    width: '100%',
    height: '100%',
  },
  hiddenImage: {
    opacity: 0,
  },
  imagePlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    zIndex: 1,
  },
  imageError: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    marginTop: 8,
    fontSize: 12,
    color: '#999999',
  },
  dealBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
    zIndex: 2,
  },
  dealText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 2,
    zIndex: 2,
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  originalPrice: {
    fontSize: 14,
    color: '#999999',
    textDecorationLine: 'line-through',
    marginBottom: 2,
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
  discountBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  discountText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});