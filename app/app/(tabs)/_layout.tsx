import { Tabs } from 'expo-router';
import { Chrome as Home, Search, ShoppingBag, MapPin, User, Utensils, Truck } from 'lucide-react-native';
import { View, StyleSheet, useWindowDimensions, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { useCart } from '../../lib/hooks/useCart';
import { useUserType } from '../context/UserTypeContext';

export default function TabLayout() {
  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 768;
  const { cartItems } = useCart();
  const [cartCount, setCartCount] = useState(0);
  const { userType } = useUserType();

  useEffect(() => {
    if (cartItems) {
      setCartCount(cartItems.length);
    }
  }, [cartItems]);

  // Render different tab layouts based on user type
  if (userType === 'restaurant') {
    return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#FF5A5F',
          tabBarInactiveTintColor: '#6B7280',
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#E5E7EB',
            height: 60,
            paddingBottom: 10,
            paddingTop: 10,
            display: isLargeScreen ? 'none' : 'flex', // Hide tab bar on large screens
          },
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: '#1F2937',
          },
          headerShown: !isLargeScreen, // Hide header on large screens
        }}>
        <Tabs.Screen
          name="restaurant-dashboard"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color, size }) => <Utensils size={size} color={color} />,
            headerTitle: 'Restaurant Dashboard',
          }}
        />
        <Tabs.Screen
          name="restaurant-orders"
          options={{
            title: 'Orders',
            tabBarIcon: ({ color, size }) => <ShoppingBag size={size} color={color} />,
            headerTitle: 'Restaurant Orders',
          }}
        />
        <Tabs.Screen
          name="restaurant-menu"
          options={{
            title: 'Menu',
            tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
            headerTitle: 'Restaurant Menu',
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
            headerTitle: 'Restaurant Profile',
          }}
        />
        <Tabs.Screen
          name="restaurant/[id]"
          options={{
            href: null,
            headerShown: false,
          }}
        />
      </Tabs>
    );
  } else if (userType === 'driver') {
    return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#FF5A5F',
          tabBarInactiveTintColor: '#6B7280',
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#E5E7EB',
            height: 60,
            paddingBottom: 10,
            paddingTop: 10,
            display: isLargeScreen ? 'none' : 'flex', // Hide tab bar on large screens
          },
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            color: '#1F2937',
          },
          headerShown: !isLargeScreen, // Hide header on large screens
        }}>
        <Tabs.Screen
          name="driver-dashboard"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color, size }) => <Truck size={size} color={color} />,
            headerTitle: 'Driver Dashboard',
          }}
        />
        <Tabs.Screen
          name="driver-deliveries"
          options={{
            title: 'Deliveries',
            tabBarIcon: ({ color, size }) => <MapPin size={size} color={color} />,
            headerTitle: 'Active Deliveries',
          }}
        />
        <Tabs.Screen
          name="driver-history"
          options={{
            title: 'History',
            tabBarIcon: ({ color, size }) => <ShoppingBag size={size} color={color} />,
            headerTitle: 'Delivery History',
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
            headerTitle: 'Driver Profile',
          }}
        />
        <Tabs.Screen
          name="restaurant/[id]"
          options={{
            href: null,
            headerShown: false,
          }}
        />
      </Tabs>
    );
  }

  // Default customer view
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FF5A5F',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: 60,
          paddingBottom: 10,
          paddingTop: 10,
          display: isLargeScreen ? 'none' : 'flex', // Hide tab bar on large screens
        },
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          color: '#1F2937',
        },
        headerShown: !isLargeScreen, // Hide header on large screens
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          headerTitle: 'OpenEats',
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
          headerTitle: 'Find Restaurants',
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.tabIconContainer}>
              <ShoppingBag size={size} color={color} />
              {cartCount > 0 && (
                <View style={styles.tabBadge}>
                  <View style={styles.tabBadgeInner}>
                    <View style={styles.tabBadgeDot} />
                  </View>
                </View>
              )}
            </View>
          ),
          headerTitle: 'Your Cart',
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, size }) => <MapPin size={size} color={color} />,
          headerTitle: 'Your Orders',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          headerTitle: 'Your Profile',
        }}
      />
      <Tabs.Screen
        name="restaurant/[id]"
        options={{
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBadge: {
    position: 'absolute',
    top: -2,
    right: -6,
    backgroundColor: 'transparent',
  },
  tabBadgeInner: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBadgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF5A5F',
  },
});