import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Mock data for the application
export const mockData = {
  // User data
  users: [
    { id: "1", email: "restaurant@example.com", name: "Tasty Bites", role: "restaurant" },
    { id: "2", email: "driver@example.com", name: "John Driver", role: "driver" },
    { id: "3", email: "admin@example.com", name: "Admin User", role: "admin" },
  ],

  // Restaurant data
  restaurants: [
    {
      id: "1",
      name: "Tasty Bites",
      description: "Delicious food for everyone",
      address: "123 Main St, Anytown, USA",
      phone: "555-123-4567",
      email: "restaurant@example.com",
      image: "/placeholder.svg?height=100&width=100",
      rating: 4.5,
      cuisine: "American",
      isOpen: true,
    },
  ],

  // Menu items
  menuItems: [
    {
      id: "1",
      restaurantId: "1",
      name: "Cheeseburger",
      description: "Juicy beef patty with cheese",
      price: 9.99,
      image: "/placeholder.svg?height=100&width=100",
      category: "Main",
      isAvailable: true,
    },
    {
      id: "2",
      restaurantId: "1",
      name: "Caesar Salad",
      description: "Fresh romaine lettuce with Caesar dressing",
      price: 7.99,
      image: "/placeholder.svg?height=100&width=100",
      category: "Salads",
      isAvailable: true,
    },
    {
      id: "3",
      restaurantId: "1",
      name: "French Fries",
      description: "Crispy golden fries",
      price: 3.99,
      image: "/placeholder.svg?height=100&width=100",
      category: "Sides",
      isAvailable: true,
    },
  ],

  // Orders
  orders: [
    {
      id: "1",
      restaurantId: "1",
      customerId: "c1",
      driverId: "2",
      items: [
        { menuItemId: "1", quantity: 2, price: 9.99 },
        { menuItemId: "3", quantity: 1, price: 3.99 },
      ],
      status: "delivered",
      total: 23.97,
      deliveryFee: 2.99,
      tax: 1.92,
      createdAt: "2023-06-15T14:30:00Z",
      deliveredAt: "2023-06-15T15:15:00Z",
      address: "456 Oak St, Anytown, USA",
    },
    {
      id: "2",
      restaurantId: "1",
      customerId: "c2",
      driverId: "2",
      items: [{ menuItemId: "2", quantity: 1, price: 7.99 }],
      status: "in_progress",
      total: 10.98,
      deliveryFee: 2.99,
      tax: 0.87,
      createdAt: "2023-06-16T12:15:00Z",
      address: "789 Pine St, Anytown, USA",
    },
    {
      id: "3",
      restaurantId: "1",
      customerId: "c3",
      items: [
        { menuItemId: "1", quantity: 1, price: 9.99 },
        { menuItemId: "2", quantity: 1, price: 7.99 },
      ],
      status: "pending",
      total: 20.97,
      deliveryFee: 2.99,
      tax: 1.8,
      createdAt: "2023-06-16T13:45:00Z",
      address: "101 Maple St, Anytown, USA",
    },
  ],

  // Drivers
  drivers: [
    {
      id: "2",
      name: "John Driver",
      email: "driver@example.com",
      phone: "555-987-6543",
      vehicle: "Honda Civic",
      licensePlate: "ABC123",
      isActive: true,
      location: { lat: 40.7128, lng: -74.006 },
      rating: 4.8,
    },
  ],

  // Earnings
  earnings: [
    { date: "2023-06-10", amount: 120.5, deliveries: 10 },
    { date: "2023-06-11", amount: 95.75, deliveries: 8 },
    { date: "2023-06-12", amount: 135.25, deliveries: 12 },
    { date: "2023-06-13", amount: 110.0, deliveries: 9 },
    { date: "2023-06-14", amount: 125.5, deliveries: 11 },
    { date: "2023-06-15", amount: 145.75, deliveries: 13 },
    { date: "2023-06-16", amount: 85.25, deliveries: 7 },
  ],

  // Revenue data for charts
  revenue: [
    { month: "Jan", amount: 4500 },
    { month: "Feb", amount: 5200 },
    { month: "Mar", amount: 6100 },
    { month: "Apr", amount: 5800 },
    { month: "May", amount: 6500 },
    { month: "Jun", amount: 7200 },
    { month: "Jul", amount: 7800 },
    { month: "Aug", amount: 8100 },
    { month: "Sep", amount: 7600 },
    { month: "Oct", amount: 7200 },
    { month: "Nov", amount: 6800 },
    { month: "Dec", amount: 7500 },
  ],

  // Platform statistics
  statistics: {
    totalRestaurants: 45,
    totalDrivers: 120,
    totalCustomers: 2500,
    totalOrders: 15000,
    averageOrderValue: 24.5,
    averageDeliveryTime: 28, // minutes
  },

  // Settings
  settings: {
    platformFee: 0.1, // 10%
    driverCommission: 0.8, // 80% of delivery fee
    taxRate: 0.08, // 8%
    defaultDeliveryFee: 2.99,
  },
}

