import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function BookingScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { hotel } = route.params;

  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    guests: '2',
    rooms: '1',
    specialRequests: ''
  });

  const [loading, setLoading] = useState(false);

  const calculateTotal = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) return 0;
    
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    return nights > 0 ? nights * hotel.price * parseInt(bookingData.rooms) : 0;
  };

  const validateBooking = () => {
    if (!bookingData.checkIn || !bookingData.checkOut) {
      Alert.alert('Error', 'Please select check-in and check-out dates');
      return false;
    }

    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      Alert.alert('Error', 'Check-in date cannot be in the past');
      return false;
    }

    if (checkOut <= checkIn) {
      Alert.alert('Error', 'Check-out date must be after check-in date');
      return false;
    }

    if (parseInt(bookingData.guests) < 1) {
      Alert.alert('Error', 'Number of guests must be at least 1');
      return false;
    }

    if (parseInt(bookingData.rooms) < 1) {
      Alert.alert('Error', 'Number of rooms must be at least 1');
      return false;
    }

    return true;
  };

  const handleConfirmBooking = async () => {
    if (!validateBooking()) return;

    setLoading(true);
    try {
      const totalNights = Math.ceil(
        (new Date(bookingData.checkOut) - new Date(bookingData.checkIn)) / (1000 * 60 * 60 * 24)
      );
      const totalPrice = calculateTotal();

      const booking = {
        hotelId: hotel.id,
        hotelName: hotel.name,
        hotelImage: hotel.image,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests: parseInt(bookingData.guests),
        rooms: parseInt(bookingData.rooms),
        totalNights,
        totalPrice,
        specialRequests: bookingData.specialRequests,
        status: 'confirmed',
        bookedAt: serverTimestamp(),
      };

      // Save to Firebase
      await addDoc(collection(db, 'users', auth.currentUser.uid, 'bookings'), booking);

      Alert.alert(
        'Booking Confirmed!',
        `Your booking at ${hotel.name} has been confirmed.\n\nTotal: R${totalPrice}`,
        [
          { 
            text: 'View Bookings', 
            onPress: () => navigation.navigate('Profile')
          },
          { 
            text: 'Continue Exploring', 
            onPress: () => navigation.navigate('Explore')
          }
        ]
      );

    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert('Error', 'Failed to confirm booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = calculateTotal();
  const nights = totalPrice / (hotel.price * parseInt(bookingData.rooms)) || 0;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.hotelName}>{hotel.name}</Text>
        <Text style={styles.hotelLocation}>{hotel.location}</Text>
      </View>

      <View style={styles.bookingForm}>
        <Text style={styles.sectionTitle}>Booking Details</Text>

        {/* Check-in Date */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Check-in Date</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={bookingData.checkIn}
            onChangeText={(text) => setBookingData({...bookingData, checkIn: text})}
          />
          <Text style={styles.helperText}>Format: YYYY-MM-DD (e.g., 2024-12-25)</Text>
        </View>

        {/* Check-out Date */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Check-out Date</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={bookingData.checkOut}
            onChangeText={(text) => setBookingData({...bookingData, checkOut: text})}
          />
          <Text style={styles.helperText}>Format: YYYY-MM-DD</Text>
        </View>

        {/* Guests */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Number of Guests</Text>
          <View style={styles.counterContainer}>
            <TouchableOpacity 
              style={styles.counterButton}
              onPress={() => setBookingData({...bookingData, guests: Math.max(1, parseInt(bookingData.guests) - 1).toString()})}
            >
              <Ionicons name="remove" size={20} color="#1a237e" />
            </TouchableOpacity>
            <Text style={styles.counterValue}>{bookingData.guests}</Text>
            <TouchableOpacity 
              style={styles.counterButton}
              onPress={() => setBookingData({...bookingData, guests: (parseInt(bookingData.guests) + 1).toString()})}
            >
              <Ionicons name="add" size={20} color="#1a237e" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Rooms */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Number of Rooms</Text>
          <View style={styles.counterContainer}>
            <TouchableOpacity 
              style={styles.counterButton}
              onPress={() => setBookingData({...bookingData, rooms: Math.max(1, parseInt(bookingData.rooms) - 1).toString()})}
            >
              <Ionicons name="remove" size={20} color="#1a237e" />
            </TouchableOpacity>
            <Text style={styles.counterValue}>{bookingData.rooms}</Text>
            <TouchableOpacity 
              style={styles.counterButton}
              onPress={() => setBookingData({...bookingData, rooms: (parseInt(bookingData.rooms) + 1).toString()})}
            >
              <Ionicons name="add" size={20} color="#1a237e" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Special Requests */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Special Requests (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Any special requirements or requests..."
            multiline
            numberOfLines={3}
            value={bookingData.specialRequests}
            onChangeText={(text) => setBookingData({...bookingData, specialRequests: text})}
          />
        </View>

        {/* Price Summary */}
        <View style={styles.priceSummary}>
          <Text style={styles.sectionTitle}>Price Summary</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>R{hotel.price} x {nights} nights x {bookingData.rooms} room(s)</Text>
            <Text style={styles.priceValue}>R{totalPrice}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>R{totalPrice}</Text>
          </View>
        </View>

        {/* Confirm Button */}
        <TouchableOpacity 
          style={[styles.confirmButton, loading && styles.buttonDisabled]}
          onPress={handleConfirmBooking}
          disabled={loading || totalPrice === 0}
        >
          <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
          <Text style={styles.confirmButtonText}>
            {loading ? 'Confirming...' : 'Confirm Booking'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  hotelName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 4,
  },
  hotelLocation: {
    fontSize: 16,
    color: '#666666',
  },
  bookingForm: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  textArea: {
    textAlignVertical: 'top',
    minHeight: 80,
  },
  helperText: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 8,
  },
  counterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1a237e',
  },
  counterValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a237e',
    minWidth: 40,
    textAlign: 'center',
  },
  priceSummary: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666666',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a237e',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a237e',
  },
  confirmButton: {
    backgroundColor: '#1a237e',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});