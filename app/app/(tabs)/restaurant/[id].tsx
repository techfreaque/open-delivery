import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Star, Clock, ChevronLeft, Plus, Minus, ShoppingBag } from 'lucide-react-native';

// Mock data for restaurants
const restaurants = [
  {
    id: '1',
    name: 'Burger Palace',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    rating: 4.8,
    deliveryTime: '15-25 min',
    category: 'American',
    description: 'Serving the juiciest burgers in town since 2010. Our beef is locally sourced and our buns are baked fresh daily.',
    address: '123 Burger St, Foodville',
    menu: [
      {
        id: 'm1',
        name: 'Double Cheeseburger',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Two juicy beef patties with melted cheese, lettuce, tomato, and our special sauce.'
      },
      {
        id: 'm2',
        name: 'Chicken Burger',
        price: 7.99,
        image: 'https://images.unsplash.com/photo-1615297319587-c22da90f58d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Grilled chicken breast with avocado, bacon, lettuce, and honey mustard.'
      },
      {
        id: 'm3',
        name: 'Fries',
        price: 3.99,
        image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Crispy golden fries seasoned with our special spice blend.'
      },
      {
        id: 'm4',
        name: 'Milkshake',
        price: 4.99,
        image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Creamy vanilla milkshake topped with whipped cream and a cherry.'
      }
    ]
  },
  {
    id: '2',
    name: 'Pizza Heaven',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    rating: 4.5,
    deliveryTime: '20-30 min',
    category: 'Italian',
    description: 'Authentic Italian pizzas made in our wood-fired oven. We use only the finest ingredients imported directly from Italy.',
    address: '456 Pizza Ave, Foodville',
    menu: [
      {
        id: 'm1',
        name: 'Pepperoni Pizza',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Classic pepperoni pizza with our signature tomato sauce and mozzarella cheese.'
      },
      {
        id: 'm2',
        name: 'Margherita Pizza',
        price: 10.99,
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Simple yet delicious with tomato sauce, fresh mozzarella, basil, and olive oil.'
      },
      {
        id: 'm3',
        name: 'Garlic Bread',
        price: 4.99,
        image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Freshly baked bread topped with garlic butter and herbs.'
      },
      {
        id: 'm4',
        name: 'Tiramisu',
        price: 6.99,
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Classic Italian dessert made with layers of coffee-soaked ladyfingers and mascarpone cream.'
      }
    ]
  },
  {
    id: '3',
    name: 'Sushi Express',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    rating: 4.7,
    deliveryTime: '25-35 min',
    category: 'Japanese',
    description: 'Fresh sushi and sashimi prepared by our expert chefs. We source our fish daily for the best quality.',
    address: '789 Sushi Blvd, Foodville',
    menu: [
      {
        id: 'm1',
        name: 'California Roll',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Crab, avocado, and cucumber wrapped in seaweed and rice, topped with tobiko.'
      },
      {
        id: 'm2',
        name: 'Salmon Nigiri',
        price: 9.99,
        image: 'https://images.unsplash.com/photo-1534482421-64566f976cfa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Fresh salmon slices on top of seasoned rice.'
      },
      {
        id: 'm3',
        name: 'Miso Soup',
        price: 3.99,
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Traditional Japanese soup with tofu, seaweed, and green onions.'
      },
      {
        id: 'm4',
        name: 'Tempura',
        price: 7.99,
        image: 'https://images.unsplash.com/photo-1615361200141-f45625b9a1bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Lightly battered and fried shrimp and vegetables.'
      }
    ]
  },
  {
    id: '4',
    name: 'Taco Fiesta',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    rating: 4.6,
    deliveryTime: '15-25 min',
    category: 'Mexican',
    description: 'Authentic Mexican street food with a modern twist. All our salsas are made fresh daily.',
    address: '101 Taco Lane, Foodville',
    menu: [
      {
        id: 'm1',
        name: 'Street Tacos',
        price: 7.99,
        image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Three corn tortillas filled with your choice of meat, topped with onions and cilantro.'
      },
      {
        id: 'm2',
        name: 'Burrito',
        price: 9.99,
        image: 'https://images.unsplash.com/photo-1584208632869-05fa2b2a5934?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Flour tortilla filled with rice, beans, cheese, and your choice of meat.'
      },
      {
        id: 'm3',
        name: 'Nachos',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Tortilla chips topped with melted cheese, jalapeños, guacamole, and sour cream.'
      },
      {
        id: 'm4',
        name: 'Churros',
        price: 4.99,
        image: 'https://images.unsplash.com/photo-1624471339379-858cc67d42b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Fried dough pastry dusted with cinnamon sugar and served with chocolate dipping sauce.'
      }
    ]
  },
  {
    id: '5',
    name: 'Noodle House',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    rating: 4.4,
    deliveryTime: '20-30 min',
    category: 'Chinese',
    description: 'Specializing in hand-pulled noodles and authentic Chinese cuisine. Family owned and operated for over 15 years.',
    address: '202 Noodle St, Foodville',
    menu: [
      {
        id: 'm1',
        name: 'Beef Noodle Soup',
        price: 10.99,
        image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Hand-pulled noodles in a rich beef broth with tender beef chunks and vegetables.'
      },
      {
        id: 'm2',
        name: 'Dumplings',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1563245424-9aae2244d7b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Steamed dumplings filled with pork and chives, served with dipping sauce.'
      },
      {
        id: 'm3',
        name: 'Fried Rice',
        price: 9.99,
        image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Wok-fried rice with eggs, vegetables, and your choice of protein.'
      },
      {
        id: 'm4',
        name: 'Spring Rolls',
        price: 5.99,
        image: 'https://images.unsplash.com/photo-1606503036653-9d9e5a3a896a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Crispy fried rolls filled with vegetables and served with sweet chili sauce.'
      }
    ]
  },
  {
    id: '6',
    name: 'Salad Bar',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    rating: 4.3,
    deliveryTime: '10-20 min',
    category: 'Healthy',
    description: 'Fresh, organic ingredients for custom salads. We partner with local farms to bring you the freshest produce.',
    address: '303 Green Ave, Foodville',
    menu: [
      {
        id: 'm1',
        name: 'Caesar Salad',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Romaine lettuce, croutons, parmesan cheese, and Caesar dressing.'
      },
      {
        id: 'm2',
        name: 'Greek Salad',
        price: 9.99,
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Mixed greens, tomatoes, cucumbers, olives, feta cheese, and Greek dressing.'
      },
      {
        id: 'm3',
        name: 'Fruit Bowl',
        price: 6.99,
        image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Seasonal fresh fruits with honey and mint.'
      },
      {
        id: 'm4',
        name: 'Smoothie',
        price: 5.99,
        image: 'https://images.unsplash.com/photo-1553530666-ba11a90bb0ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        description: 'Blend of fruits, yogurt, and honey. Choose from various flavors.'
      }
    ]
  },
];

export default function RestaurantScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [restaurant, setRestaurant] = useState(null);
  const [selectedItems, setSelectedItems] = useState({});

  useEffect(() => {
    // Find the restaurant by id
    const foundRestaurant = restaurants.find(r => r.id === id);
    if (foundRestaurant) {
      setRestaurant(foundRestaurant);
    }
  }, [id]);

  const handleAddItem = (item) => {
    setSelectedItems(prev => {
      const currentQuantity = prev[item.id] || 0;
      return {
        ...prev,
        [item.id]: currentQuantity + 1
      };
    });
  };

  const handleRemoveItem = (item) => {
    setSelectedItems(prev => {
      const currentQuantity = prev[item.id] || 0;
      if (currentQuantity <= 1) {
        const newItems = { ...prev };
        delete newItems[item.id];
        return newItems;
      }
      return {
        ...prev,
        [item.id]: currentQuantity - 1
      };
    });
  };

  const getTotalItems = () => {
    return Object.values(selectedItems).reduce((sum, quantity) => sum + quantity, 0);
  };

  const getTotalPrice = () => {
    if (!restaurant) return 0;
    
    return restaurant.menu.reduce((sum, item) => {
      const quantity = selectedItems[item.id] || 0;
      return sum + (item.price * quantity);
    }, 0);
  };

  const handleAddToCart = () => {
    if (getTotalItems() === 0) return;
    
    const cartItems = restaurant.menu
      .filter(item => selectedItems[item.id])
      .map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: selectedItems[item.id],
        image: item.image,
        restaurant: restaurant.name
      }));
    
    // In a real app, you would dispatch to a cart store or context
    // For now, we'll just navigate to the cart
    alert(`Added ${getTotalItems()} items to cart for $${getTotalPrice().toFixed(2)}`);
    router.push('/cart');
  };

  if (!restaurant) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header Image */}
        <View style={styles.headerContainer}>
          <Image source={{ uri: restaurant.image }} style={styles.headerImage} />
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Restaurant Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          <Text style={styles.restaurantCategory}>{restaurant.category}</Text>
          
          <View style={styles.restaurantMeta}>
            <View style={styles.ratingContainer}>
              <Star size={16} color="#FFD700" fill="#FFD700" />
              <Text style={styles.ratingText}>{restaurant.rating}</Text>
            </View>
            <View style={styles.timeContainer}>
              <Clock size={16} color="#6B7280" />
              <Text style={styles.timeText}>{restaurant.deliveryTime}</Text>
            </View>
          </View>
          
          <Text style={styles.restaurantAddress}>{restaurant.address}</Text>
          <Text style={styles.restaurantDescription}>{restaurant.description}</Text>
        </View>

        {/* Menu */}
        <View style={styles.menuContainer}>
          <Text style={styles.menuTitle}>Menu</Text>
          
          {restaurant.menu.map((item) => (
            <View key={item.id} style={styles.menuItem}>
              <View style={styles.menuItemInfo}>
                <Text style={styles.menuItemName}>{item.name}</Text>
                <Text style={styles.menuItemDescription}>{item.description}</Text>
                <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
              </View>
              
              <View style={styles.menuItemRight}>
                <Image source={{ uri: item.image }} style={styles.menuItemImage} />
                
                <View style={styles.quantityControls}>
                  {selectedItems[item.id] ? (
                    <>
                      <TouchableOpacity 
                        style={styles.quantityButton}
                        onPress={() => handleRemoveItem(item)}
                      >
                        <Minus size={16} color="#FF5A5F" />
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{selectedItems[item.id]}</Text>
                    </>
                  ) : null}
                  
                  <TouchableOpacity 
                    style={styles.quantityButton}
                    onPress={() => handleAddItem(item)}
                  >
                    <Plus size={16} color="#FF5A5F" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Cart Button */}
      {getTotalItems() > 0 && (
        <View style={styles.cartButtonContainer}>
          <TouchableOpacity 
            style={styles.cartButton}
            onPress={handleAddToCart}
          >
            <View style={styles.cartButtonLeft}>
              <View style={styles.cartItemCount}>
                <Text style={styles.cartItemCountText}>{getTotalItems()}</Text>
              </View>
              <Text style={styles.cartButtonText}>Add to Cart</Text>
            </View>
            <Text style={styles.cartButtonPrice}>${getTotalPrice().toFixed(2)}</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerContainer: {
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: 200,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 8,
  },
  infoContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  restaurantCategory: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
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
  restaurantAddress: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  restaurantDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginTop: 8,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 16,
  },
  menuItemInfo: {
    flex: 1,
    marginRight: 12,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  menuItemRight: {
    alignItems: 'center',
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  cartButtonContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cartButton: {
    backgroundColor: '#FF5A5F',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cartButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartItemCount: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  cartItemCountText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF5A5F',
  },
  cartButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cartButtonPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});