import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Image, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Star, Clock, X, MapPin, ChevronRight } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Mock data for restaurants
const allRestaurants = [
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
  {
    id: '7',
    name: 'Indian Spice',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356c36?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    rating: 4.6,
    deliveryTime: '25-35 min',
    category: 'Indian',
  },
  {
    id: '8',
    name: 'Mediterranean Delight',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    rating: 4.5,
    deliveryTime: '20-30 min',
    category: 'Mediterranean',
  },
];

// Filter categories
const filterCategories = [
  { id: '1', name: 'All' },
  { id: '2', name: 'Fast Food' },
  { id: '3', name: 'Healthy' },
  { id: '4', name: 'Italian' },
  { id: '5', name: 'Asian' },
  { id: '6', name: 'Mexican' },
];

// Saved addresses
const savedAddresses = [
  { id: '1', address: '123 Main St, Anytown', default: true },
  { id: '2', address: '456 Oak St, Anytown', default: false },
  { id: '3', address: '789 Pine St, Anytown', default: false },
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('1'); // Default to 'All'
  const [recentSearches, setRecentSearches] = useState(['Pizza', 'Burger', 'Sushi']);
  const [address, setAddress] = useState('123 Main St, Anytown');
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('1');
  const [newAddress, setNewAddress] = useState('');
  const [customAddressMode, setCustomAddressMode] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    // Handle category or section from params
    if (params.category) {
      setSearchQuery(params.category.toString());
    } else if (params.section) {
      // Handle section filtering if needed
    }
  }, [params]);

  // Filter restaurants based on search query and selected filter
  const filteredRestaurants = allRestaurants.filter(restaurant => {
    const matchesSearch = 
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedFilter === '1') return matchesSearch; // All
    if (selectedFilter === '2') return matchesSearch && ['American', 'Italian'].includes(restaurant.category); // Fast Food
    if (selectedFilter === '3') return matchesSearch && restaurant.category === 'Healthy'; // Healthy
    if (selectedFilter === '4') return matchesSearch && restaurant.category === 'Italian'; // Italian
    if (selectedFilter === '5') return matchesSearch && ['Japanese', 'Chinese'].includes(restaurant.category); // Asian
    if (selectedFilter === '6') return matchesSearch && restaurant.category === 'Mexican'; // Mexican
    
    return matchesSearch;
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query && !recentSearches.includes(query)) {
      setRecentSearches([query, ...recentSearches.slice(0, 4)]);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const removeRecentSearch = (search) => {
    setRecentSearches(recentSearches.filter(item => item !== search));
  };

  const handleRestaurantPress = (id) => {
    router.push(`/restaurant/${id}`);
  };

  const handleAddressSelect = (id, addressText) => {
    setSelectedAddress(id);
    setAddress(addressText);
    setLocationModalVisible(false);
  };

  const handleAddNewAddress = () => {
    if (newAddress.trim() === '') {
      alert('Please enter a valid address');
      return;
    }
    
    // In a real app, this would validate and save the address to the user's profile
    setAddress(newAddress);
    setLocationModalVisible(false);
    alert('New delivery address added');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Location Header */}
      <TouchableOpacity 
        style={styles.locationHeader}
        onPress={() => setLocationModalVisible(true)}
      >
        <View style={styles.locationRow}>
          <MapPin size={16} color="#FF5A5F" style={styles.locationIcon} />
          <Text style={styles.locationText}>{address}</Text>
          <ChevronRight size={16} color="#6B7280" />
        </View>
      </TouchableOpacity>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={20} color="#6B7280" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for restaurants or cuisines"
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#9CA3AF"
        />
        {searchQuery ? (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <X size={20} color="#6B7280" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Filter Categories */}
      <View style={styles.filterContainer}>
        <FlatList
          data={filterCategories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterItem,
                selectedFilter === item.id && styles.selectedFilterItem,
              ]}
              onPress={() => setSelectedFilter(item.id)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === item.id && styles.selectedFilterText,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Recent Searches (show only if no search query and there are recent searches) */}
      {!searchQuery && recentSearches.length > 0 && (
        <View style={styles.recentSearchesContainer}>
          <Text style={styles.recentSearchesTitle}>Recent Searches</Text>
          {recentSearches.map((search, index) => (
            <View key={index} style={styles.recentSearchItem}>
              <TouchableOpacity 
                style={styles.recentSearchTextContainer}
                onPress={() => setSearchQuery(search)}
              >
                <Clock size={16} color="#6B7280" />
                <Text style={styles.recentSearchText}>{search}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removeRecentSearch(search)}>
                <X size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Search Results */}
      {searchQuery ? (
        <FlatList
          data={filteredRestaurants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.restaurantItem}
              onPress={() => handleRestaurantPress(item.id)}
            >
              <Image source={{ uri: item.image }} style={styles.restaurantImage} />
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{item.name}</Text>
                <Text style={styles.restaurantCategory}>{item.category}</Text>
                <View style={styles.restaurantMeta}>
                  <View style={styles.ratingContainer}>
                    <Star size={14} color="#FFD700" fill="#FFD700" />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                  </View>
                  <View style={styles.timeContainer}>
                    <Clock size={14} color="#6B7280" />
                    <Text style={styles.timeText}>{item.deliveryTime}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyResultContainer}>
              <Text style={styles.emptyResultText}>No restaurants found</Text>
              <Text style={styles.emptyResultSubText}>Try a different search term</Text>
            </View>
          }
        />
      ) : (
        // Show popular searches when no search query
        <View style={styles.popularContainer}>
          <Text style={styles.popularTitle}>Popular Cuisines</Text>
          <View style={styles.popularGrid}>
            {['Pizza', 'Burgers', 'Sushi', 'Mexican', 'Chinese', 'Indian'].map((cuisine, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.popularItem}
                onPress={() => setSearchQuery(cuisine)}
              >
                <Text style={styles.popularItemText}>{cuisine}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

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
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#1F2937',
  },
  clearButton: {
    padding: 4,
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  selectedFilterItem: {
    backgroundColor: '#FF5A5F',
  },
  filterText: {
    fontSize: 14,
    color: '#4B5563',
  },
  selectedFilterText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  recentSearchesContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  recentSearchesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  recentSearchTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentSearchText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
  },
  restaurantItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  restaurantImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  restaurantInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
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
  emptyResultContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyResultText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyResultSubText: {
    fontSize: 14,
    color: '#6B7280',
  },
  popularContainer: {
    padding: 16,
  },
  popularTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  popularGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  popularItem: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  popularItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    textAlign: 'center',
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