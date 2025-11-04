import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, ImageBackground, Alert, Modal, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function HotelDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { hotel } = route.params;
  
  const [reviews, setReviews] = useState([
    {
      id: '1',
      userName: 'Martin Khoza',
      rating: 5,
      comment: 'Excellent service and beautiful location! Will definitely come back.',
      date: '2024-01-15',
    },
    {
      id: '2',
      userName: 'Mahelehele Omphulusa',
      rating: 4,
      comment: 'Great hotel with amazing breakfast. Staff was very helpful.',
      date: '2024-01-10',
    },
  ]);
  
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  const handleBookNow = () => {
    if (!auth.currentUser) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to book a hotel',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => navigation.navigate('SignIn') }
        ]
      );
      return;
    }
    navigation.navigate('Booking', { hotel });
  };

  const handleAddReview = async () => {
    if (!newReview.comment.trim()) {
      Alert.alert('Error', 'Please write a review comment');
      return;
    }

    const review = {
      id: Date.now().toString(),
      userName: auth.currentUser?.displayName || 'Anonymous',
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0],
    };

    // Save to Firebase
    try {
      await addDoc(collection(db, 'hotels', hotel.id, 'reviews'), {
        ...review,
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error saving review:', error);
    }

    setReviews([review, ...reviews]);
    setNewReview({ rating: 5, comment: '' });
    setShowReviewModal(false);
    Alert.alert('Success', 'Thank you for your review!');
  };

  const renderStars = (rating, size = 16, interactive = false, onPress = null) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => interactive && onPress(star)} disabled={!interactive}>
            <Ionicons
              name={star <= rating ? "star" : "star-outline"}
              size={size}
              color="#FFA000"
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Image source={{ uri: hotel.image }} style={styles.hotelImage} />
        
        <View style={styles.content}>
          <Text style={styles.hotelName}>{hotel.name}</Text>
          
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={20} color="#666666" />
            <Text style={styles.location}>{hotel.location}</Text>
          </View>

          <View style={styles.ratingPriceContainer}>
            <View style={styles.ratingContainer}>
              {renderStars(Math.floor(hotel.rating))}
              <Text style={styles.ratingText}>{hotel.rating}</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>R{hotel.price}</Text>
              <Text style={styles.night}>/night</Text>
            </View>
          </View>

          <Text style={styles.description}>{hotel.description}</Text>

          <View style={styles.amenities}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesList}>
              <View style={styles.amenity}>
                <Ionicons name="wifi" size={20} color="#1a237e" />
                <Text style={styles.amenityText}>Free WiFi</Text>
              </View>
              <View style={styles.amenity}>
                <Ionicons name="restaurant" size={20} color="#1a237e" />
                <Text style={styles.amenityText}>Restaurant</Text>
              </View>
              <View style={styles.amenity}>
                <Ionicons name="fitness" size={20} color="#1a237e" />
                <Text style={styles.amenityText}>Fitness Center</Text>
              </View>
              <View style={styles.amenity}>
                <Ionicons name="water" size={20} color="#1a237e" />
                <Text style={styles.amenityText}>Pool</Text>
              </View>
            </View>
          </View>

          {/* Reviews Section (A5 - 5 marks) */}
          <View style={styles.reviews}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.sectionTitle}>Guest Reviews</Text>
              <TouchableOpacity 
                style={styles.addReviewButton}
                onPress={() => setShowReviewModal(true)}
              >
                <Ionicons name="add" size={20} color="#1a237e" />
                <Text style={styles.addReviewText}>Add Review</Text>
              </TouchableOpacity>
            </View>
            
            {reviews.length === 0 ? (
              <Text style={styles.noReviews}>No reviews yet. Be the first to review!</Text>
            ) : (
              reviews.map(review => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewRow}>
                    <ImageBackground
                      source={require('../assets/Materials/09-Account Page/profile-1 copy.png')}
                      style={styles.avatarBg}
                    >
                      <Image
                        source={require('../assets/Materials/09-Account Page/profile-1 copy.png')}
                        style={styles.reviewAvatar}
                        resizeMode="cover"
                      />
                    </ImageBackground>

                    <View style={styles.reviewBody}>
                      <View style={styles.reviewHeader}>
                        <Text style={styles.reviewerName}>{review.userName}</Text>
                        {renderStars(review.rating)}
                      </View>
                      <Text style={styles.reviewComment}>{review.comment}</Text>
                      <Text style={styles.reviewDate}>{review.date}</Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {/* Book Now Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
          <Ionicons name="calendar" size={20} color="#ffffff" />
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>

      {/* Add Review Modal (A5 - 5 marks) */}
      <Modal
        visible={showReviewModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Your Review</Text>
              <TouchableOpacity onPress={() => setShowReviewModal(false)}>
                <Ionicons name="close" size={24} color="#666666" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.ratingLabel}>Your Rating</Text>
            {renderStars(newReview.rating, 28, true, (rating) => 
              setNewReview({...newReview, rating})
            )}
            
            <Text style={styles.commentLabel}>Your Review</Text>
            <TextInput
              style={styles.commentInput}
              placeholder="Share your experience..."
              multiline
              numberOfLines={4}
              value={newReview.comment}
              onChangeText={(text) => setNewReview({...newReview, comment: text})}
            />
            
            <TouchableOpacity style={styles.submitReviewButton} onPress={handleAddReview}>
              <Text style={styles.submitReviewText}>Submit Review</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  hotelImage: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 16,
  },
  hotelName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  location: {
    color: '#666666',
    marginLeft: 8,
    fontSize: 16,
  },
  ratingPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  ratingText: {
    color: '#000000',
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
    marginLeft: 4,
  },
  description: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 16,
  },
  amenities: {
    marginBottom: 24,
  },
  amenitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  amenity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  amenityText: {
    color: '#1a237e',
    fontSize: 14,
  },
  reviews: {
    marginBottom: 100,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addReviewText: {
    color: '#1a237e',
    fontSize: 14,
    fontWeight: '500',
  },
  noReviews: {
    textAlign: 'center',
    color: '#666666',
    fontStyle: 'italic',
    marginVertical: 20,
  },
  reviewCard: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  reviewRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  avatarBg: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  reviewBody: {
    flex: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerName: {
    fontWeight: 'bold',
    color: '#000000',
  },
  reviewComment: {
    color: '#666666',
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewDate: {
    color: '#999999',
    fontSize: 12,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  bookButton: {
    backgroundColor: '#1a237e',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a237e',
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 12,
  },
  commentLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginTop: 20,
    marginBottom: 8,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    textAlignVertical: 'top',
    minHeight: 100,
    fontSize: 16,
  },
  submitReviewButton: {
    backgroundColor: '#1a237e',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitReviewText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});