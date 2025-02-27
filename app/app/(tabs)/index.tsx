import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, Star, Clock, MapPin, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';

// Mock data for featured restaurants
const featuredRestaurants = [
  {
    id: '1',
    name: 'Burger Palace',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    rating: 4.8,
    deliveryTime: '15-25 min',
    category: 'American',
  },
  {
    id: '2',
    name: 'Pizza Heaven',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    rating: 4.5,
    deliveryTime: '20-30 min',
    category: 'Italian',
  },
  {
    id: '3',
    name: 'Sushi Express',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    rating: 4.7,
    deliveryTime: '25-35 min',
    category: 'Japanese',
  },
];

// Mock data for food categories
const categories = [
  { id: '1', name: 'Pizza', icon: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60' },
  { id: '2', name: 'Burgers', icon: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60' },
  { id: '3', name: 'Sushi', icon: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60' },
  { id: '4', name: 'Mexican', icon: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60' },
  { id: '5', name: 'Chinese', icon: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60' },
];

// Mock data for popular restaurants
const popularRestaurants = [
  {
    id: '4',
    name: 'Taco Fiesta',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    rating: 4.6,
    deliveryTime: '15-25 min',
    category: 'Mexican',
  },
  {
    id: '5',
    name: 'Noodle House',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    rating: 4.4,
    deliveryTime: '20-30 min',
    category: 'Chinese',
  },
  {
    id: '6',
    name: 'Salad Bar',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    rating: 4.3,
    deliveryTime: '10-20 min',
    category: 'Healthy',
  },
];

// Saved addresses
const savedAddresses = [
  { id: '1', address: '123 Main St, Anytown', default: true },
  { id: '2', address: '456 Oak St, Anytown', default: false },
  { id: '3', address: '789 Pine St, Anytown', default: false },
];

export default function HomeScreen() {
  const [address, setAddress] = useState('123 Main St, Anytown');
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('1');
  const [newAddress, setNewAddress] = useState('');
  const [customAddressMode, setCustomAddressMode] = useState(false);
  const router = useRouter();

  const handleRestaurantPress = (id) => {
    router.push(`/restaurant/${id}`);
  };

  const handleCategoryPress = (category) => {
    router.push({
      pathname: '/search',
      params: { category }
    });
  };

  const handleSeeAllPress = (section) => {
    router.push({
      pathname: '/search',
      params: { section }
    });
  };

  const handleAddressSelect = (id, addressText) => {
    setSelectedAddress(id);
    setAddress(addressText);
    setLocationModalVisible(false);
  };

  const handleAddNewAddress = () => {
    if (newAddress.trim() === '') {
      Alert.alert('Error', 'Please enter a valid address');
      return;
    }
    
    // In a real app, this would validate and save the address to the user's profile
    setAddress(newAddress);
    setLocationModalVisible(false);
    Alert.alert('Success', 'New delivery address added');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Location Header */}
        <TouchableOpacity 
          style={styles.locationHeader}
          onPress={() => setLocationModalVisible(true)}
        >
          <Text style={styles.locationLabel}>Delivering to</Text>
          <View style={styles.locationRow}>
            <MapPin size={16} color="#FF5A5F" style={styles.locationIcon} />
            <Text style={styles.locationText}>{address}</Text>
            <ChevronRight size={16} color="#6B7280" />
          </View>
        </TouchableOpacity>

        {/* Featured Restaurants */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Restaurants</Text>
            <TouchableOpacity onPress={() => handleSeeAllPress('Featured Restaurants')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScrollView}>
            {featuredRestaurants.map((restaurant) => (
              <TouchableOpacity 
                key={restaurant.id} 
                style={styles.restaurantCard}
                onPress={() => handleRestaurantPress(restaurant.id)}
              >
                <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
                <View style={styles.restaurantInfo}>
                  <Text style={styles.restaurantName}>{restaurant.name}</Text>
                  <Text style={styles.restaurantCategory}>{restaurant.category}</Text>
                  <View style={styles.restaurantMeta}>
                    <View style={styles.ratingContainer}>
                      <Star size={14} color="#FFD700" fill="#FFD700" />
                      <Text style={styles.ratingText}>{restaurant.rating}</Text>
                    </View>
                    <View style={styles.timeContainer}>
                      <Clock size={14} color="#6B7280" />
                      <Text style={styles.timeText}>{restaurant.deliveryTime}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Categories */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
          </View>
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.categoryItem}
                onPress={() => handleCategoryPress(item.name)}
              >
                <Image source={{ uri: item.icon }} style={styles.categoryIcon} />
                <Text style={styles.categoryName}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Popular Restaurants */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Near You</Text>
            <TouchableOpacity onPress={() => handleSeeAllPress('Popular Restaurants')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          {popularRestaurants.map((restaurant) => (
            <TouchableOpacity 
              key={restaurant.id} 
              style={styles.popularRestaurantCard}
              onPress={() => handleRestaurantPress(restaurant.id)}
            >
              <Image source={{ uri: restaurant.image }} style={styles.popularRestaurantImage} />
              <View style={styles.popularRestaurantInfo}>
                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                <Text style={styles.restaurantCategory}>{restaurant.category}</Text>
                <View style={styles.restaurantMeta}>
                  <View style={styles.ratingContainer}>
                    <Star size={14} color="#FFD700" fill="#FFD700" />
                    <Text style={styles.ratingText}>{restaurant.rating}</Text>
                  </View>
                  <View style={styles.timeContainer}>
                    <Clock size={14} color="#6B7280" />
                    <Text style={styles.timeText}>{restaurant.deliveryTime}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Location Selection Modal */}
      <Modal
        visible={locationModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setLocationModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Delivery Address</Text>
              <TouchableOpacity onPress={() => setLocationModalVisible(false)}>
                <X size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>

            {!customAddressMode ? (
              <>
                <Text style={styles.modalSubtitle}>Saved Addresses</Text>
                {savedAddresses.map((item) => (
                  <TouchableOpacity 
                    key={item.id} 
                    style={[
                      styles.addressItem,
                      selectedAddress === item.id && styles.selectedAddressItem
                    ]}
                    onPress={() => handleAddressSelect(item.id, item.address)}
                  >
                    <View style={styles.addressItemContent}>
                      <MapPin size={20} color={selectedAddress === item.id ? "#FFFFFF" : "#FF5A5F"} />
                      <View style={styles.addressItemText}>
                        <Text style={[
                          styles.addressText,
                          selectedAddress === item.id && styles.selectedAddressText
                        ]}>
                          {item.address}
                        </Text>
                        {item.default && (
                          <Text style={[
                            styles.defaultText,
                            selectedAddress === item.id && styles.selectedDefaultText
                          ]}>
                            Default
                          </Text>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity 
                  style={styles.addAddressButton}
                  onPress={() => setCustomAddressMode(true)}
                >
                  <Text style={styles.addAddressButtonText}>Add New Address</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.modalSubtitle}>Enter New Address</Text>
                <TextInput
                  style={styles.addressInput}
                  placeholder="Enter your full address"
                  value={newAddress}
                  onChangeText={setNewAddress}
                  multiline
                />
                <View style={styles.addressButtonsRow}>
                  <TouchableOpacity 
                    style={[styles.addressActionButton, styles.cancelButton]}
                    onPress={() => setCustomAddressMode(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.addressActionButton, styles.saveButton]}
                    onPress={handleAddNewAddress}
                  >
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  locationHeader: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  locationLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationIcon: {
    marginRight: 4,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 4,
    flex: 1,
  },
  sectionContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  seeAllText: {
    fontSize: 14,
    color: '#FF5A5F',
    fontWeight: '600',
  },
  horizontalScrollView: {
    marginLeft: -8,
  },
  restaurantCard: {
    width: 240,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  restaurantImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  restaurantInfo: {
    padding: 12,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  restaurantCategory: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  ratingText: {
    fontSize: 14,
    color: '#1F2937',
    marginLeft: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 24,
    width: 70,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    color: '#1F2937',
    textAlign: 'center',
  },
  popularRestaurantCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  popularRestaurantImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  popularRestaurantInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
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
    color: '#1F2937',
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 12,
  },
  addressItem: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  selectedAddressItem: {
    backgroundColor: '#FF5A5F',
  },
  addressItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressItemText: {
    marginLeft: 12,
    flex: 1,
  },
  addressText: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
  },
  selectedAddressText: {
    color: '#FFFFFF',
  },
  defaultText: {
    fontSize: 12,
    color: '#6B7280',
  },
  selectedDefaultText: {
    color: '#FFFFFF',
  },
  addAddressButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  addAddressButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF5A5F',
  },
  addressInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  addressButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addressActionButton: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
  },
  saveButton: {
    backgroundColor: '#FF5A5F',
    marginLeft: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});