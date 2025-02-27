import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Minus, Plus, Trash2, CreditCard, Banknote, MapPin, ChevronRight, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';

// Mock cart data
const initialCartItems = [
  {
    id: '1',
    name: 'Double Cheeseburger',
    price: 8.99,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    restaurant: 'Burger Palace',
  },
  {
    id: '2',
    name: 'Pepperoni Pizza',
    price: 12.99,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    restaurant: 'Pizza Heaven',
  },
  {
    id: '3',
    name: 'Fries',
    price: 3.99,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    restaurant: 'Burger Palace',
  },
];

// Saved addresses
const savedAddresses = [
  { id: '1', address: '123 Main St, Anytown', default: true },
  { id: '2', address: '456 Oak St, Anytown', default: false },
  { id: '3', address: '789 Pine St, Anytown', default: false },
];

// Payment methods
const savedPaymentMethods = [
  { id: '1', type: 'Visa', last4: '4242', default: true },
  { id: '2', type: 'Mastercard', last4: '5555', default: false },
];

export default function CartScreen() {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' or 'card'
  const [selectedCardId, setSelectedCardId] = useState('1');
  const [deliveryAddress, setDeliveryAddress] = useState(savedAddresses.find(addr => addr.default).address);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('1');
  const [newAddress, setNewAddress] = useState('');
  const [customAddressMode, setCustomAddressMode] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [orderPlacedModalVisible, setOrderPlacedModalVisible] = useState(false);
  const router = useRouter();

  const updateQuantity = (id, change) => {
    setCartItems(
      cartItems.map((item) => {
        if (item.id === id) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      })
    );
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const subtotal = calculateSubtotal();
  const deliveryFee = paymentMethod === 'cash' ? 0 : 2.99;
  const serviceFee = paymentMethod === 'cash' ? 0 : 1.99;
  const total = subtotal + deliveryFee + serviceFee;

  const handleAddressSelect = (id, addressText) => {
    setSelectedAddress(id);
    setDeliveryAddress(addressText);
    setLocationModalVisible(false);
  };

  const handleAddNewAddress = () => {
    if (newAddress.trim() === '') {
      Alert.alert('Error', 'Please enter a valid address');
      return;
    }
    
    // In a real app, this would validate and save the address to the user's profile
    setDeliveryAddress(newAddress);
    setLocationModalVisible(false);
    Alert.alert('Success', 'New delivery address added');
  };

  const handleSelectPaymentMethod = (method, cardId = null) => {
    setPaymentMethod(method);
    if (method === 'card' && cardId) {
      setSelectedCardId(cardId);
    }
    setPaymentModalVisible(false);
  };

  const handleCheckout = () => {
    Alert.alert(
      "Confirm Order",
      `Your order will be placed with ${paymentMethod === 'cash' ? 'cash' : 'card'} payment.`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Place Order", 
          onPress: () => {
            // Show order placed modal
            setOrderPlacedModalVisible(true);
          }
        }
      ]
    );
  };

  const handleOrderComplete = () => {
    setOrderPlacedModalVisible(false);
    setCartItems([]);
    router.push('/orders');
  };

  const handleRestaurantPress = (restaurantName) => {
    // In a real app, we would find the restaurant ID based on the name
    // For now, we'll just show an alert
    Alert.alert("View Restaurant", `You want to view ${restaurantName}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {cartItems.length > 0 ? (
        <>
          <ScrollView style={styles.scrollView}>
            {/* Cart Items */}
            <View style={styles.cartItemsContainer}>
              {cartItems.map((item) => (
                <View key={item.id} style={styles.cartItem}>
                  <Image source={{ uri: item.image }} style={styles.itemImage} />
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <TouchableOpacity onPress={() => handleRestaurantPress(item.restaurant)}>
                      <Text style={styles.restaurantName}>{item.restaurant}</Text>
                    </TouchableOpacity>
                    <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                  </View>
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity 
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(item.id, -1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={16} color={item.quantity <= 1 ? '#D1D5DB' : '#1F2937'} />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity 
                      style={styles.quantityButton}
                      onPress={() => updateQuantity(item.id, 1)}
                    >
                      <Plus size={16} color="#1F2937" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => removeItem(item.id)}
                    >
                      <Trash2 size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            {/* Delivery Address */}
            <TouchableOpacity 
              style={styles.deliveryAddressContainer}
              onPress={() => setLocationModalVisible(true)}
            >
              <View style={styles.deliveryAddressHeader}>
                <Text style={styles.sectionTitle}>Delivery Address</Text>
                <ChevronRight size={16} color="#6B7280" />
              </View>
              <View style={styles.deliveryAddressContent}>
                <MapPin size={20} color="#FF5A5F" />
                <Text style={styles.deliveryAddressText}>{deliveryAddress}</Text>
              </View>
            </TouchableOpacity>

            {/* Payment Method */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Payment Method</Text>
              <View style={styles.paymentOptions}>
                <TouchableOpacity 
                  style={[
                    styles.paymentOption, 
                    paymentMethod === 'cash' && styles.selectedPaymentOption
                  ]}
                  onPress={() => setPaymentMethod('cash')}
                >
                  <Banknote 
                    size={24} 
                    color={paymentMethod === 'cash' ? '#FFFFFF' : '#1F2937'} 
                  />
                  <Text 
                    style={[
                      styles.paymentOptionText,
                      paymentMethod === 'cash' && styles.selectedPaymentOptionText
                    ]}
                  >
                    Cash (Free)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.paymentOption, 
                    paymentMethod === 'card' && styles.selectedPaymentOption
                  ]}
                  onPress={() => setPaymentModalVisible(true)}
                >
                  <CreditCard 
                    size={24} 
                    color={paymentMethod === 'card' ? '#FFFFFF' : '#1F2937'} 
                  />
                  <Text 
                    style={[
                      styles.paymentOptionText,
                      paymentMethod === 'card' && styles.selectedPaymentOptionText
                    ]}
                  >
                    Card
                  </Text>
                </TouchableOpacity>
              </View>
              {paymentMethod === 'card' && (
                <TouchableOpacity 
                  style={styles.selectedCardContainer}
                  onPress={() => setPaymentModalVisible(true)}
                >
                  <View style={styles.selectedCardInfo}>
                    <CreditCard size={16} color="#6B7280" />
                    <Text style={styles.selectedCardText}>
                      {savedPaymentMethods.find(card => card.id === selectedCardId)?.type} ending in {savedPaymentMethods.find(card => card.id === selectedCardId)?.last4}
                    </Text>
                  </View>
                  <ChevronRight size={16} color="#6B7280" />
                </TouchableOpacity>
              )}
            </View>

            {/* Order Summary */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Order Summary</Text>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                <Text style={styles.summaryValue}>
                  {paymentMethod === 'cash' ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Service Fee</Text>
                <Text style={styles.summaryValue}>
                  {paymentMethod === 'cash' ? 'FREE' : `$${serviceFee.toFixed(2)}`}
                </Text>
              </View>
              <View style={[styles.summaryItem, styles.totalItem]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
              </View>
            </View>
          </ScrollView>

          {/* Checkout Button */}
          <View style={styles.checkoutContainer}>
            <TouchableOpacity 
              style={styles.checkoutButton}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutButtonText}>Place Order</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.emptyCartContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1586074299757-dc655f18518c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' }} 
            style={styles.emptyCartImage} 
          />
          <Text style={styles.emptyCartTitle}>Your cart is empty</Text>
          <Text style={styles.emptyCartText}>Add items from restaurants to start an order</Text>
          <TouchableOpacity 
            style={styles.browseButton}
            onPress={() => router.push('/')}
          >
            <Text style={styles.browseButtonText}>Browse Restaurants</Text>
          </TouchableOpacity>
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

      {/* Payment Method Modal */}
      <Modal
        visible={paymentModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPaymentModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Payment Method</Text>
              <TouchableOpacity onPress={() => setPaymentModalVisible(false)}>
                <X size={24} color="#1F2937" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[
                styles.paymentMethodItem,
                paymentMethod === 'cash' && styles.selectedPaymentMethodItem
              ]}
              onPress={() => handleSelectPaymentMethod('cash')}
            >
              <View style={styles.paymentMethodContent}>
                <Banknote size={24} color={paymentMethod === 'cash' ? "#FFFFFF" : "#1F2937"} />
                <View style={styles.paymentMethodInfo}>
                  <Text style={[
                    styles.paymentMethodName,
                    paymentMethod === 'cash' && styles.selectedPaymentMethodText
                  ]}>
                    Cash on Delivery
                  </Text>
                  <Text style={[
                    styles.paymentMethodDescription,
                    paymentMethod === 'cash' && styles.selectedPaymentMethodText
                  ]}>
                    Pay when your order arrives
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <Text style={styles.modalSubtitle}>Saved Cards</Text>
            {savedPaymentMethods.map((card) => (
              <TouchableOpacity 
                key={card.id} 
                style={[
                  styles.paymentMethodItem,
                  paymentMethod === 'card' && selectedCardId === card.id && styles.selectedPaymentMethodItem
                ]}
                onPress={() => handleSelectPaymentMethod('card', card.id)}
              >
                <View style={styles.paymentMethodContent}>
                  <CreditCard size={24} color={paymentMethod === 'card' && selectedCardId === card.id ? "#FFFFFF" : "#1F2937"} />
                  <View style={styles.paymentMethodInfo}>
                    <Text style={[
                      styles.paymentMethodName,
                      paymentMethod === 'card' && selectedCardId === card.id && styles.selectedPaymentMethodText
                    ]}>
                      {card.type} ending in {card.last4}
                    </Text>
                    {card.default && (
                      <Text style={[
                        styles.defaultText,
                        paymentMethod === 'card' && selectedCardId === card.id && styles.selectedPaymentMethodText
                      ]}>
                        Default
                      </Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity 
              style={styles.addCardButton}
              onPress={() => {
                setPaymentModalVisible(false);
                router.push('/profile');
                Alert.alert('Add Card', 'You can add a new card in your profile settings');
              }}
            >
              <Text style={styles.addCardButtonText}>Add New Card</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Order Placed Modal */}
      <Modal
        visible={orderPlacedModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setOrderPlacedModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.orderSuccessContainer}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1576867757603-05b134ebc379?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' }} 
                style={styles.orderSuccessImage} 
              />
              <Text style={styles.orderSuccessTitle}>Order Placed!</Text>
              <Text style={styles.orderSuccessText}>
                Your order has been successfully placed and will be delivered to you soon.
              </Text>
              <TouchableOpacity 
                style={styles.orderSuccessButton}
                onPress={handleOrderComplete}
              >
                <Text style={styles.orderSuccessButtonText}>Track Your Order</Text>
              </TouchableOpacity>
            </View>
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
  scrollView: {
    flex: 1,
  },
  cartItemsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cartItem: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 16,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
    textDecorationLine: 'underline',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginLeft: 8,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginHorizontal: 8,
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  deliveryAddressContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 16,
    marginTop: 0,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  deliveryAddressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  deliveryAddressContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryAddressText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
    flex: 1,
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 16,
    marginTop: 0,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  paymentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 8,
  },
  selectedPaymentOption: {
    backgroundColor: '#FF5A5F',
  },
  paymentOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginLeft: 8,
  },
  selectedPaymentOptionText: {
    color: '#FFFFFF',
  },
  selectedCardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  selectedCardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedCardText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#4B5563',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  totalItem: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 8,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  checkoutContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  checkoutButton: {
    backgroundColor: '#FF5A5F',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyCartContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyCartImage: {
    width: 200,
    height: 200,
    marginBottom: 24,
    borderRadius: 100,
  },
  emptyCartTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyCartText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#FF5A5F',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  browseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
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
    marginTop: 16,
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
  paymentMethodItem: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  selectedPaymentMethodItem: {
    backgroundColor: '#FF5A5F',
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodInfo: {
    marginLeft: 12,
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
  },
  paymentMethodDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  selectedPaymentMethodText: {
    color: '#FFFFFF',
  },
  addCardButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  addCardButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF5A5F',
  },
  orderSuccessContainer: {
    alignItems: 'center',
    padding: 16,
  },
  orderSuccessImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 24,
  },
  orderSuccessTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  orderSuccessText: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 24,
  },
  orderSuccessButton: {
    backgroundColor: '#FF5A5F',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
  },
  orderSuccessButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});