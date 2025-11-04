import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Modal, TextInput, Image } from 'react-native';
import { signOut, updateProfile } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, collection, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [cancellingBooking, setCancellingBooking] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      setEditName(currentUser.displayName || '');
      
      try {
        // Get user profile from Firestore
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUser(prev => ({ ...prev, ...userDoc.data() }));
        }

        // Get user bookings from Firestore
        const bookingsSnapshot = await getDocs(collection(db, 'users', currentUser.uid, 'bookings'));
        const userBookings = [];
        bookingsSnapshot.forEach(doc => {
          userBookings.push({ id: doc.id, ...doc.data() });
        });
        
        // Sort bookings by date (newest first)
        userBookings.sort((a, b) => new Date(b.bookedAt?.toDate() || 0) - new Date(a.bookedAt?.toDate() || 0));
        setBookings(userBookings);
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to load user data');
      }
    }
    setLoading(false);
  };

  const handleUpdateProfile = async () => {
    if (!editName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    try {
      await updateProfile(auth.currentUser, {
        displayName: editName
      });

      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        name: editName,
        updatedAt: new Date(),
      });

      setUser(prev => ({ ...prev, displayName: editName }));
      setShowEditModal(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleCancelBooking = async (bookingId, hotelName) => {
    Alert.alert(
      'Cancel Booking',
      `Are you sure you want to cancel your booking at ${hotelName}?`,
      [
        { text: 'Keep Booking', style: 'cancel' },
        { 
          text: 'Cancel Booking', 
          style: 'destructive',
          onPress: async () => {
            try {
              setCancellingBooking(bookingId);
              const currentUser = auth.currentUser;
              
              // Delete booking from Firestore
              await deleteDoc(doc(db, 'users', currentUser.uid, 'bookings', bookingId));
              
              // Update local state
              setBookings(prev => prev.filter(booking => booking.id !== bookingId));
              
              Alert.alert('Success', 'Booking cancelled successfully');
            } catch (error) {
              console.error('Error cancelling booking:', error);
              Alert.alert('Error', 'Failed to cancel booking. Please try again.');
            } finally {
              setCancellingBooking(null);
            }
          }
        },
      ]
    );
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
            } catch (error) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isBookingUpcoming = (checkInDate) => {
    const today = new Date();
    const checkIn = new Date(checkInDate);
    return checkIn > today;
  };

  const getBookingStatus = (booking) => {
    const today = new Date();
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);

    if (booking.cancelled) {
      return { status: 'Cancelled', color: '#f44336', bgColor: '#ffebee' };
    } else if (today > checkOut) {
      return { status: 'Completed', color: '#666666', bgColor: '#f5f5f5' };
    } else if (today >= checkIn && today <= checkOut) {
      return { status: 'Active', color: '#2196F3', bgColor: '#e3f2fd' };
    } else {
      return { status: 'Confirmed', color: '#4CAF50', bgColor: '#E8F5E8' };
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="person" size={50} color="#1a237e" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* HEADER WITH PROFILE ICON */}
      <View style={styles.header}>
        <View style={styles.profileHeader}>
          <Image
            source={require('../assets/Materials/09-Account Page/profile-1 copy.png')}
            style={styles.profileImage}
            resizeMode="cover"
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.displayName || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <Text style={styles.memberSince}>Member since 2024</Text>
          </View>
        </View>
      </View>

      {/* BOOKINGS SECTION */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="calendar" size={24} color="#1a237e" />
          <Text style={styles.sectionTitle}>My Bookings</Text>
        </View>
        {bookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={50} color="#cccccc" />
            <Text style={styles.emptyStateText}>No bookings yet</Text>
            <Text style={styles.emptyStateSubtext}>Your upcoming stays will appear here</Text>
          </View>
        ) : (
          bookings.map(booking => {
            const statusInfo = getBookingStatus(booking);
            const isUpcoming = isBookingUpcoming(booking.checkIn);
            
            return (
              <View key={booking.id} style={[
                styles.bookingCard,
                statusInfo.status === 'Cancelled' && styles.cancelledBookingCard
              ]}>
                <View style={styles.bookingHeader}>
                  <Text style={styles.hotelName}>{booking.hotelName}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: statusInfo.bgColor }]}>
                    <Text style={[styles.bookingStatus, { color: statusInfo.color }]}>
                      {statusInfo.status}
                    </Text>
                  </View>
                </View>
                <View style={styles.bookingDetails}>
                  <View style={styles.bookingDetail}>
                    <Ionicons name="calendar-outline" size={16} color="#666666" />
                    <Text style={styles.bookingText}>
                      {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                    </Text>
                  </View>
                  <View style={styles.bookingDetail}>
                    <Ionicons name="people-outline" size={16} color="#666666" />
                    <Text style={styles.bookingText}>
                      {booking.guests} guests • {booking.rooms} room(s)
                    </Text>
                  </View>
                  <View style={styles.bookingDetail}>
                    <Ionicons name="cash-outline" size={16} color="#666666" />
                    <Text style={styles.bookingText}>R{booking.totalPrice}</Text>
                  </View>
                  <View style={styles.bookingDetail}>
                    <Ionicons name="moon-outline" size={16} color="#666666" />
                    <Text style={styles.bookingText}>{booking.totalNights} nights</Text>
                  </View>
                </View>
                
                {/* Cancel Button for upcoming bookings */}
                {isUpcoming && statusInfo.status === 'Confirmed' && (
                  <TouchableOpacity 
                    style={[
                      styles.cancelButton,
                      cancellingBooking === booking.id && styles.cancelButtonDisabled
                    ]}
                    onPress={() => handleCancelBooking(booking.id, booking.hotelName)}
                    disabled={cancellingBooking === booking.id}
                  >
                    <Ionicons 
                      name={cancellingBooking === booking.id ? "hourglass-outline" : "close-circle-outline"} 
                      size={16} 
                      color="#d32f2f" 
                    />
                    <Text style={styles.cancelButtonText}>
                      {cancellingBooking === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        )}
      </View>

      {/* ACTION BUTTONS */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => setShowEditModal(true)}
        >
          <Ionicons name="create-outline" size={20} color="#1a237e" />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ffffff" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* EDIT PROFILE MODAL */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="person" size={24} color="#1a237e" />
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Ionicons name="close" size={24} color="#666666" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalLabel}>Full Name</Text>
            <TextInput
              style={styles.modalInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="Enter your name"
            />
            
            <TouchableOpacity style={styles.saveButton} onPress={handleUpdateProfile}>
              <Ionicons name="checkmark" size={20} color="#ffffff" />
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  header: {
    padding: 24,
    backgroundColor: '#f8f8f8',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    marginRight: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 14,
    color: '#999999',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a237e',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
  },
  bookingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  cancelledBookingCard: {
    backgroundColor: '#fafafa',
    borderColor: '#ffcdd2',
    opacity: 0.7,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  hotelName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bookingStatus: {
    fontSize: 12,
    fontWeight: '500',
  },
  bookingDetails: {
    gap: 8,
    marginBottom: 12,
  },
  bookingDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bookingText: {
    color: '#666666',
    fontSize: 14,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  cancelButtonDisabled: {
    opacity: 0.6,
  },
  cancelButtonText: {
    color: '#d32f2f',
    fontSize: 14,
    fontWeight: '500',
  },
  actions: {
    padding: 20,
    gap: 12,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1a237e',
  },
  editButtonText: {
    color: '#1a237e',
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#d32f2f',
    borderRadius: 12,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
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
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a237e',
    flex: 1,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1a237e',
    padding: 16,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});