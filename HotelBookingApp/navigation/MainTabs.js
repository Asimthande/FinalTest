import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';

import ExploreScreen from '../screens/ExploreScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HotelDetailsScreen from '../screens/HotelDetailsScreen';
import BookingScreen from '../screens/BookingScreen';
import DealsScreen from '../screens/DealsScreen';

const Tab = createBottomTabNavigator();
const ExploreStack = createNativeStackNavigator();
const DealsStack = createNativeStackNavigator();

function ExploreStackScreen() {
  return (
    <ExploreStack.Navigator>
      <ExploreStack.Screen 
        name="ExploreMain" 
        component={ExploreScreen} 
        options={{ title: 'Find Hotels' }}
      />
      <ExploreStack.Screen 
        name="HotelDetails" 
        component={HotelDetailsScreen} 
        options={{ title: 'Hotel Details' }}
      />
      <ExploreStack.Screen 
        name="Booking" 
        component={BookingScreen} 
        options={{ title: 'Book Your Stay' }}
      />
    </ExploreStack.Navigator>
  );
}

function DealsStackScreen() {
  return (
    <DealsStack.Navigator>
      <DealsStack.Screen 
        name="DealsMain" 
        component={DealsScreen} 
        options={{ title: 'Recommended Hotels' }}
      />
      <DealsStack.Screen 
        name="HotelDetails" 
        component={HotelDetailsScreen} 
        options={{ title: 'Hotel Details' }}
      />
      <DealsStack.Screen 
        name="Booking" 
        component={BookingScreen} 
        options={{ title: 'Book Your Stay' }}
      />
    </DealsStack.Navigator>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          // Use provided assets for tab icons
          const icons = {
            Explore: require('../assets/Materials/06-Explore Page/search.png'),
            Deals: require('../assets/Materials/06-Explore Page/Systems _ heart-fill.png'),
            Profile: require('../assets/Materials/06-Explore Page/profile-1 copy.png'),
          };

          const source = icons[route.name];
          if (source) {
            return (
              <Image
                source={source}
                style={{ width: size, height: size, tintColor: color }}
                resizeMode="contain"
              />
            );
          }

          // Fallback to vector icon if no image found
          let iconName;
          if (route.name === 'Explore') iconName = focused ? 'search' : 'search-outline';
          else if (route.name === 'Deals') iconName = focused ? 'flash' : 'flash-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1a237e',
        tabBarInactiveTintColor: '#666666',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e0e0e0',
        },
        headerStyle: {
          backgroundColor: '#1a237e',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Explore" 
        component={ExploreStackScreen} 
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Deals" 
        component={DealsStackScreen} 
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'My Profile' }}
      />
    </Tab.Navigator>
  );
}