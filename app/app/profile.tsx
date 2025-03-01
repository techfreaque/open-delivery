import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Switch, Alert, TextInput, Modal, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight, LogOut, CreditCard, Bell, MapPin, CircleHelp as HelpCircle, Settings, Heart, Gift, Edit2, Utensils, Truck } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import DesktopHeader from '../components/DesktopHeader';
import UserTypeSwitcher from '../components/UserTypeSwitcher';
import { useUserType } from './context/UserTypeContext';
import { useCart } from '../lib/hooks/useCart';
import { useAddresses } from '../lib/hooks/useAddresses';
import { usePaymentMethods } from '../lib/hooks/usePaymentMethods';
import { authApi } from '../lib/api-client';

export default function ProfileScreen() {
  const router = useRouter();
  const { userType } = useUserType();
  const { cartItems } = useCart();
  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 768;
  
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    image: '',
  });
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedUser, setEditedUser] = useState({...user});
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [newAddressText, setNewAddressText] = useState('');
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('');
  const [newCardCVV, setNewCardCVV] = useState('');
  const [favoritesModalVisible, setFavoritesModalVisible] = useState(false);
  const [currentAddress, setCurrentAddress] = useState('');

  const { 
    addresses, 
    defaultAddress, 
    isLoading: isLoadingAddresses, 
    error: errorAddresses, 
    addAddress, 
    setDefault: setDefaultAddressHook, 
    removeAddress,
		fetchAddresses
  } = useAddresses();
  
  const { 
    paymentMethods, 
    defaultPaymentMethod, 
    isLoading: isLoadingPayments, 
    error: errorPayments, 
    addPaymentMethod, 
    setDefault: setDefaultPaymentMethodHook, 
    removePaymentMethod,
		fetchPaymentMethods
  } = usePaymentMethods();

  const fetchUserProfile = async () => {
    try {
      const userData = await authApi.getCurrentUser();
      setUser(userData);
      setEditedUser(userData);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      Alert.alert("Error", "Failed to load user profile.");
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchAddresses();
    fetchPaymentMethods();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Logout", 
          onPress: async () => {
            try {
              await authApi.logout();
              router.replace("/");
            } catch (error) {
              console.error("Logout failed:", error);
              Alert.alert("Error", "Logout failed. Please try again.");
            }
          }
        }
      ]
    );
  };

  const handleSaveProfile = () => {
    setUser(editedUser);
    setEditModalVisible(false);
    Alert.alert("Success", "Profile updated successfully");
  };

  const handleAddAddress = async () => {
    if (newAddressText.trim() === '') {
      Alert.alert("Error", "Please enter a valid address");
      return;
    }

    await addAddress({ address: newAddressText, is_default: false });
    setNewAddressText('');
    setAddressModalVisible(false);
    Alert.alert("Success", "Address added successfully");
  };

  const handleSetDefaultAddress = async (id) => {
    await setDefaultAddressHook(id);
  };

  const handleDeleteAddress = async (id) => {
    await removeAddress(id);
  };

  const handleAddPaymentMethod = async () => {
    if (newCardNumber.length < 16 || newCardExpiry.trim() === '' || newCardCVV.length < 3) {
      Alert.alert("Error", "Please enter valid card details");
      return;
    }

    const last4 = newCardNumber.slice(-4);
    await addPaymentMethod({ type: 'Card', last4: last4, is_default: false });
    setNewCardNumber('');
    setNewCardExpiry('');
    setNewCardCVV('');
    setPaymentModalVisible(false);
    Alert.alert("Success", "Payment method added successfully");
  };

  const handleSetDefaultPayment = async (id) => {
    await setDefaultPaymentMethodHook(id);
  };

  const handleDeletePayment = async (id) => {
    await removePaymentMethod(id);
  };

  const handleViewFavoriteRestaurant = (id) => {
    setFavoritesModalVisible(false);
    router.push(`/restaurant/${id}`);
  };

  const handleAddressChange = (address) => {
    setCurrentAddress(address);
  };

  // Get user profile image and name based on user type
  const getUserProfileInfo = () => {
    return user;
  };

  const profileInfo = getUserProfileInfo();

  // Different menu sections based on user type
  const getMenuSections = () => {
    if (userType === 'restaurant') {
      return [
        {
          title: 'Restaurant Management',
          items: [
            { 
              icon: <Utensils size={24} color="#FF5A5F" />, 
              title: 'Restaurant Details',
              onPress: () => Alert.alert("Restaurant Details", "Edit your restaurant information")
            },
            { 
              icon: <MapPin size={24} color="#FF5A5F" />, 
              title: 'Business Address',
              onPress: () => setAddressModalVisible(true)
            },
            { 
              icon: <Heart size={24} color="#FF5A5F" />, 
              title: 'Menu Management',
              onPress: () => router.push('/restaurant-menu')
            },
          ]
        },
        {
          title: 'Preferences',
          items: [
            { 
              icon: <Bell size={24} color="#FF5A5F" />, 
              title: 'Notifications',
              toggle: true,
              value: notificationsEnabled,
              onToggle: setNotificationsEnabled
            },
          ]
        },
        {
          title: 'Support',
          items: [
            { 
              icon: <HelpCircle size={24} color="#FF5A5F" />, 
              title: 'Help Center',
              onPress: () => Alert.alert("Help Center", "Our support team is available 24/7")
            },
            { 
              icon: <Gift size={24} color="#FF5A5F" />, 
              title: 'About OpenEats',
              onPress: () => Alert.alert("About OpenEats", "OpenEats is a free, open-source food delivery platform")
            },
          ]
        },
      ];
    } else if (userType === 'driver') {
      return [
        {
          title: 'Driver Account',
          items: [
            { 
              icon: <CreditCard size={24} color="#FF5A5F" />, 
              title: 'Payment Information',
              onPress: () => setPaymentModalVisible(true)
            },
            { 
              icon: <MapPin size={24} color="#FF5A5F" />, 
              title: 'Vehicle Information',
              onPress: () => Alert.alert("Vehicle Information", "Update your vehicle details")
            },
            { 
              icon: <Truck size={24} color="#FF5A5F" />, 
              title: 'Delivery History',
              onPress: () => router.push('/driver-history')
            },
          ]
        },
        {
          title: 'Preferences',
          items: [
            { 
              icon: <Bell size={24} color="#FF5A5F" />, 
              title: 'Notifications',
              toggle: true,
              value: notificationsEnabled,
              onToggle: setNotificationsEnabled
            },
            { 
              icon: <MapPin size={24} color="#FF5A5F" />, 
              title: 'Location Services',
              toggle: true,
              value: locationEnabled,
              onToggle: setLocationEnabled
            },
          ]
        },
        {
          title: 'Support',
          items: [
            { 
              icon: <HelpCircle size={24} color="#FF5A5F" />, 
              title: 'Help Center',
              onPress: () => Alert.alert("Help Center", "Our support team is available 24/7")
            },
            { 
              icon: <Gift size={24} color="#FF5A5F" />, 
              title: 'About OpenEats',
              onPress: () => Alert.alert("About OpenEats", "OpenEats is a free, open-source food delivery platform")
            },
          ]
        },
      ];
    }

    // Default customer view
    return [
      {
        title: 'Account',
        items: [
          { 
            icon: <CreditCard size={24} color="#FF5A5F" />, 
            title: 'Payment Methods',
            onPress: () => setPaymentModalVisible(true)
          },
          { 
            icon: <MapPin size={24} color="#FF5A5F" />, 
            title: 'Saved Addresses',
            onPress: () => setAddressModalVisible(true)
          },
          { 
            icon: <Heart size={24} color="#FF5A5F" />, 
            title: 'Favorite Restaurants',
            onPress: () => setFavoritesModalVisible(true)
          },
        ]
      },
      {
        title: 'Preferences',
        items: [
          { 
            icon: <Bell size={24} color="#FF5A5F" />, 
            title: 'Notifications',
            toggle: true,
            value: notificationsEnabled,
            onToggle: setNotificationsEnabled
          },
          { 
            icon: <MapPin size={24} color="#FF5A5F" />, 
            title: 'Location Services',
            toggle: true,
            value: locationEnabled,
            onToggle: setLocationEnabled
          },
        ]
      },
      {
        title: 'Support',
        items: [
          { 
            icon: <HelpCircle size={24} color="#FF5A5F" />, 
            title: 'Help Center',
            onPress: () => Alert.alert("Help Center", "Our support team is available 24/7")
          },
          { 
            icon: <Gift size={24} color="#FF5A5F" />, 
            title: 'About OpenEats',
            onPress: () => Alert.alert("About OpenEats", "OpenEats is a free, open-source food delivery platform")
          },
        ]
      },
    ];
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLargeScreen && (
        <DesktopHeader 
          currentAddress={currentAddress} 
          onAddressChange={handleAddressChange}
          cartItemCount={cartItems?.length || 0}
        />
      )}
      <ScrollView>
        <View style={[styles.contentContainer, isLargeScreen && styles.largeScreenContentContainer]}>
          {/* User Type Switcher */}
          <UserTypeSwitcher />

          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <Image source={{ uri: profileInfo.image }} style={styles.profileImage} />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{profileInfo.name}</Text>
              <Text style={styles.profileEmail}>{profileInfo.email}</Text>
              <Text style={styles.profilePhone}>{profileInfo.phone}</Text>
            </View>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => {
                setEditedUser({...profileInfo});
                setEditModalVisible(true);
              }}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>

          {/* Menu Sections */}
          {getMenuSections().map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.menuSection}>
              <Text style={styles.menuSectionTitle}>{section.title}</Text>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity 
                  key={itemIndex} 
                  style={styles.menuItem}
                  onPress={item.onPress}
                  disabled={item.toggle}
                >
                  <View style={styles.menuItemLeft}>
                    {item.icon}
                    <Text style={styles.menuItemTitle}>{item.title}</Text>
                  </View>
                  {item.toggle ? (
                    <Switch
                      value={item.value}
                      onValueChange={item.onToggle}
                      trackColor={{ false: '#D1D5DB', true: '#FF5A5F' }}
                      thumbColor={'#FFFFFF'}
                    />
                  ) : (
                    <ChevronRight size={20} color="#9CA3AF" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          {/* App Version */}
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, isLargeScreen && styles.largeScreenModalContent]}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={editedUser.name}
                onChangeText={(text) => setEditedUser({...editedUser, name: text})}
                placeholder="Enter your name"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={editedUser.email}
                onChangeText={(text) => setEditedUser({...editedUser, email: text})}
                placeholder="Enter your email"
                keyboardType="email-address"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone</Text>
              <TextInput
                style={styles.input}
                value={editedUser.phone}
                onChangeText={(text) => setEditedUser({...editedUser, phone: text})}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveProfile}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Addresses Modal */}
      <Modal
        visible={addressModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAddressModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, isLargeScreen && styles.largeScreenModalContent]}>
            <Text style={styles.modalTitle}>Saved Addresses</Text>
            
            {addresses?.map((address) => (
              <View key={address.id} style={styles.addressItem}>
                <View style={styles.addressInfo}>
                  <Text style={styles.addressText}>{address.address}</Text>
                  {address.is_default && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>Default</Text>
                    </View>
                  )}
                </View>
                <View style={styles.addressActions}>
                  {!address.is_default && (
                    <TouchableOpacity 
                      style={styles.addressActionButton}
                      onPress={() => handleSetDefaultAddress(address.id)}
                    >
                      <Text style={styles.addressActionButtonText}>Set Default</Text>
                    </TouchableOpacity>
                  )}
                  {!address.is_default && (
                    <TouchableOpacity 
                      style={[styles.addressActionButton, styles.deleteButton]}
                      onPress={() => handleDeleteAddress(address.id)}
                    >
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Add New Address</Text>
              <TextInput
                style={styles.input}
                value={newAddressText}
                onChangeText={setNewAddressText}
                placeholder="Enter address"
              />
              <TouchableOpacity 
                style={styles.addButton}
                onPress={handleAddAddress}
              >
                <Text style={styles.addButtonText}>Add Address</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setAddressModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Payment Methods Modal */}
      <Modal
        visible={paymentModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPaymentModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, isLargeScreen && styles.largeScreenModalContent]}>
            <Text style={styles.modalTitle}>Payment Methods</Text>
            
            {paymentMethods?.map((method) => (
              <View key={method.id} style={styles.paymentItem}>
                <View style={styles.paymentInfo}>
                  <CreditCard size={24} color="#1F2937" />
                  <View style={styles.paymentDetails}>
                    <Text style={styles.paymentType}>{method.type}</Text>
                    <Text style={styles.paymentNumber}>**** **** **** {method.last4}</Text>
                  </View>
                  {method.is_default ? (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>Default</Text>
                    </View>
                  ) : null}
                </View>
                <View style={styles.paymentActions}>
                  {!method.is_default ? (
                    <TouchableOpacity 
                      style={styles.paymentActionButton}
                      onPress={() => handleSetDefaultPayment(method.id)}
                    >
                      <Text style={styles.paymentActionButtonText}>Set Default</Text>
                    </TouchableOpacity>
                  ) : null}
                  {!method.is_default ? (
                    <TouchableOpacity 
                      style={[styles.paymentActionButton, styles.deleteButton]}
                      onPress={() => handleDeletePayment(method.id)}
                    >
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            ))}
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Add New Card</Text>
              <TextInput
                style={styles.input}
                value={newCardNumber}
                onChangeText={setNewCardNumber}
                placeholder="Card Number"
                keyboardType="number-pad"
                maxLength={16}
              />
              <View style={styles.cardDetailsRow}>
                <TextInput
                  style={[styles.input, styles.cardDetailInput]}
                  value={newCardExpiry}
                  onChangeText={setNewCardExpiry}
                  placeholder="MM/YY"
                  maxLength={5}
                />
                <TextInput
                  style={[styles.input, styles.cardDetailInput]}
                  value={newCardCVV}
                  onChangeText={setNewCardCVV}
                  placeholder="CVV"
                  keyboardType="number-pad"
                  maxLength={3}
                />
              </View>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={handleAddPaymentMethod}
              >
                <Text style={styles.addButtonText}>Add Card</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setPaymentModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Favorites Modal */}
      <Modal
        visible={favoritesModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFavoritesModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, isLargeScreen && styles.largeScreenModalContent]}>
            <Text style={styles.modalTitle}>Favorite Restaurants</Text>
            
            {favoriteRestaurants.map((restaurant) => (
              <TouchableOpacity 
                key={restaurant.id} 
                style={styles.favoriteItem}
                onPress={() => handleViewFavoriteRestaurant(restaurant.id)}
              >
                <View style={styles.favoriteInfo}>
                  <Heart size={20} color="#FF5A5F" fill="#FF5A5F" />
                  <Text style={styles.favoriteName}>{restaurant.name}</Text>
                </View>
                <ChevronRight size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
            
            {favoriteRestaurants.length === 0 && (
              <Text style={styles.emptyText}>You don't have any favorite restaurants yet</Text>
            )}
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setFavoritesModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
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
  contentContainer: {
    padding: 16,
  },
  largeScreenContentContainer: {
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  profilePhone: {
    fontSize: 14,
    color: '#6B7280',
  },
  editButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemTitle: {
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 8,
  },
  versionText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 24,
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
  largeScreenModalContent: {
    maxWidth: 600,
    alignSelf: 'center',
    marginTop: 100,
    marginBottom: 100,
    borderRadius: 20,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 8,
  },
  modalButtons: {
    flexDirection: 'row',
  },
  addressItem: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  paymentItem: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  addressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 16,
    color: '#1F2937',
    flex: 1,
  },
  paymentDetails: {
    flex: 1,
    marginLeft: 12,
  },
  paymentType: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  paymentNumber: {
    fontSize: 14,
    color: '#6B7280',
  },
  defaultBadge: {
    backgroundColor: '#10B981',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  defaultBadgeText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  addressActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  paymentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  addressActionButton: {
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  paymentActionButton: {
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  addressActionButtonText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '500',
  },
  paymentActionButtonText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
  },
  deleteButtonText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#FF5A5F',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  closeButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
  },
  cardDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardDetailInput: {
    flex: 1,
    marginRight: 8,
  },
  favoriteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  favoriteInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteName: {
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginVertical: 24,
  },
    paddingVertical: 4,
});
    marginLeft: 8,
  },
  addressActionButtonText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '500',
  },
  paymentActionButtonText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#FEE2E2',
  },
  deleteButtonText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#FF5A5F',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  closeButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
  },
  cardDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardDetailInput: {
    flex: 1,
    marginRight: 8,
  },
  favoriteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  favoriteInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteName: {
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginVertical: 24,
  },
});