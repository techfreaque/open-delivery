import type {
  AdminRegisterType,
  CategoryUpdateType,
  OrderUpdateType,
} from "@/types/types";
import {
  type AddressCreateType,
  type CartItemUpdateType,
  type DriverCreateType,
  type MenuItemCreateType,
  type OrderCreateType,
  type RestaurantCreateType,
  UserRoleValue,
} from "@/types/types";

export interface ExamplesList<T> {
  [exampleKey: string]: T;
}

class Examples {
  // Test data collections for seeding the database and the api explorer
  private userExamples: ExamplesList<AdminRegisterType & { id: string }> = {
    admin: {
      id: "e6f5f3f0-3aa7-4b50-9450-a1e88c590b44",
      firstName: "Admin",
      lastName: "User",
      email: "admin@example.com",
      password: "password",
      confirmPassword: "password",
      userRoles: [{ role: UserRoleValue.ADMIN }],
    },
    customer: {
      id: "88111873-5dc8-4c4b-93ff-82c2377f5f02",
      firstName: "Customer",
      lastName: "User",
      email: "customer@example.com",
      password: "password",
      confirmPassword: "password",
      userRoles: [{ role: UserRoleValue.CUSTOMER }],
    },
    restaurantAdmin: {
      id: "b2f74947-41dc-4e67-995d-97de70f8644e",
      firstName: "Restaurant",
      lastName: "Owner",
      email: "restaurant@example.com",
      password: "password",
      confirmPassword: "password",
      userRoles: [{ role: UserRoleValue.CUSTOMER }],
    },
    restaurantEmployee: {
      id: "0ad1148e-6114-4194-a51c-dc991ae0fb0e",
      firstName: "Restaurant",
      lastName: "Employee",
      email: "restaurant.employee@example.com",
      password: "password",
      confirmPassword: "password",
      userRoles: [{ role: UserRoleValue.CUSTOMER }],
    },
    driver: {
      id: "87f23e96-1d90-4d63-98d3-2ad207ad65a7",
      firstName: "Delivery",
      lastName: "Driver",
      email: "driver@example.com",
      password: "password",
      confirmPassword: "password",
      userRoles: [
        { role: UserRoleValue.CUSTOMER },
        { role: UserRoleValue.DRIVER },
      ],
    },
  };

  private categoryExamples: ExamplesList<CategoryUpdateType> = {
    test1: {
      name: "Pizza",
      image: "https://example.com/pizza.jpg",
      id: "9bfb43b8-c361-4f3e-b512-ec2ced9bf665",
    },
    test2: {
      name: "Burgers",
      image: "https://example.com/burgers.jpg",
      id: "f3fd90ec-1471-4ea7-9ffd-5bfad977b364",
    },
  };

  private restaurantExamples: ExamplesList<
    RestaurantCreateType & { id: string }
  > = {
    example1: {
      id: "a50e2a24-bca7-4a98-aa59-79c6c11c2547",
      name: "Pizza Palace",
      description: "Best pizza in town!",
      image: "https://example.com/pizza-palace.jpg",
      phone: "+1234567890",
      email: "contact@pizzapalace.com",
      published: true,
      mainCategoryId: this.categoryExamples.test1.id,
      street: "456 Restaurant Ave",
      streetNumber: "12",
      city: "Foodville",
      zip: "54321",
      countryId: "DE",
      latitude: 40.712,
      longitude: -74.005,
      userRoles: [
        {
          userId: this.userExamples.restaurantAdmin.id,
          role: UserRoleValue.RESTAURANT_ADMIN,
        },
      ],
    },
    example2: {
      id: "e74ce4c1-418d-4df1-ae06-419c703f61dd",
      name: "Burger Barn",
      description: "Juicy burgers and great fries!",
      image: "https://example.com/burger-barn.jpg",
      phone: "+1234567891",
      email: "contact@burgerbarn.com",
      published: true,
      mainCategoryId: this.categoryExamples.test2.id,
      userRoles: [
        {
          userId: this.userExamples.restaurantAdmin.id,
          role: UserRoleValue.RESTAURANT_ADMIN,
        },
      ],
      street: "789 Beef St",
      streetNumber: "34",
      city: "Foodville",
      zip: "54322",
      countryId: "AT",
      latitude: 40.713,
      longitude: -74.007,
    },
  };

  private menuItemExamples: ExamplesList<MenuItemCreateType & { id: string }> =
    {
      example1: {
        id: "700b99f9-7284-420c-842c-38aaaa59fcbd",
        name: "Margherita Pizza",
        description: "Classic cheese and tomato pizza",
        price: 9.99,
        image: "https://example.com/margherita.jpg",
        taxPercent: 8.0,
        published: true,
        availableFrom: null,
        availableTo: null,
        categoryId: this.categoryExamples.test1.id,
        restaurantId: this.restaurantExamples.example1.id,
      },
      example2: {
        id: "31e69db7-cfc0-4e6a-bada-2120118c7ad9",
        name: "Blabla Burger",
        description: "with extra rat poison",
        price: 9.99,
        image: "https://example.com/margherita.jpg",
        taxPercent: 10.0,
        published: true,
        availableFrom: null,
        availableTo: null,
        categoryId: this.categoryExamples.test2.id,
        restaurantId: this.restaurantExamples.example2.id,
      },
    };

  private orderExamples: ExamplesList<
    OrderCreateType & OrderUpdateType & { id: string }
  > = {
    example1: {
      id: "03820091-b135-4e0b-877e-8a26b4265274",
      restaurantId: this.restaurantExamples.example1.id,
      orderItems: [
        {
          menuItemId: this.menuItemExamples.example1.id,
          quantity: 2,
          message: "without cheese",
        },
      ],
      customerId: this.userExamples.customer.id,
      delivery: {
        street: "789 Beef St",
        streetNumber: "34",
        city: "Foodville",
        zip: "54322",
        countryId: "AT",
        latitude: 40.713,
        longitude: -74.007,
        distance: 3.5,
        estimatedDeliveryTime: 25,
        estimatedPreparationTime: 20,
        message: "ring the doorbell",
        phone: "+1234567890",
        status: "ASSIGNED",
        type: "DELIVERY",
        driverId: this.userExamples.driver.id,
      },
      status: "NEW",
      message: "extra ketchup",
      deliveryFee: 2,
      driverTip: 1,
      restaurantTip: 1,
      projectTip: 1,
    },
    example2: {
      id: "8d5fef47-2b8e-4187-9554-527e6a524073",
      restaurantId: this.restaurantExamples.example2.id,
      orderItems: [
        {
          menuItemId: this.menuItemExamples.example2.id,
          quantity: 2,
          message: "without cheese",
        },
      ],
      status: "DELIVERED",
      customerId: this.userExamples.customer.id,
      delivery: {
        street: null,
        streetNumber: null,
        city: null,
        zip: null,
        countryId: null,
        latitude: null,
        longitude: null,
        distance: null,
        estimatedDeliveryTime: null,
        estimatedPreparationTime: 20,
        message: "Hello",
        phone: "+1234567890",
        status: "ASSIGNED",
        type: "PICKUP",
        driverId: null,
      },
      message: "ring the doorbell",
      deliveryFee: 2,
      driverTip: 1,
      restaurantTip: 1,
      projectTip: 1,
    },
  };

  private driverExamples: ExamplesList<DriverCreateType & { id: string }> = {
    example1: {
      id: "edf5063b-e4f3-4571-a3ea-63062d82ff1f",
      userId: this.userExamples.driver.id,
      vehicle: "Toyota Corolla",
      licensePlate: "ABC-123",
      city: "Foodville",
      street: "123 Driver St",
      streetNumber: "56",
      zip: "54323",
      countryId: "AT",
      radius: 10,
    },
  };

  private addressExamples: ExamplesList<AddressCreateType & { id: string }> = {
    example1: {
      id: "01f197a3-43f9-4767-a25f-e6029071166d",
      userId: this.userExamples.customer.id,
      message: "Ring the doorbell",
      name: "John Smith",
      label: "Home",
      isDefault: false,
      street: "street",
      streetNumber: "14",
      zip: "435435",
      city: "dfgdf",
      phone: "+1234567890",
      countryId: "DE",
    },
    example2: {
      id: "537c1e1f-b5da-4003-a4c9-f07fa10a7ce6",
      userId: this.userExamples.customer.id,
      label: "mommie",
      name: "John Smith",
      message: null,
      isDefault: false,
      street: "street",
      streetNumber: "88",
      zip: "435435",
      city: "dfgdf",
      phone: "+1234567890",
      countryId: "DE",
    },
  };

  private cartExamples: ExamplesList<CartItemUpdateType & { id: string }> = {
    example1: {
      id: "a47916a4-2588-40a0-8146-94b090cf42d2",
      menuItemId: this.menuItemExamples.example1.id,
      restaurantId: this.restaurantExamples.example1.id,
      quantity: 2,
      userId: this.userExamples.customer.id,
    },
  };

  // Test data for database seeding
  get testData(): {
    userExamples: ExamplesList<AdminRegisterType & { id: string }>;
    restaurantExamples: ExamplesList<RestaurantCreateType & { id: string }>;
    categoryExamples: ExamplesList<CategoryUpdateType>;
    menuItemExamples: ExamplesList<MenuItemCreateType & { id: string }>;
    orderExamples: ExamplesList<
      OrderCreateType & OrderUpdateType & { id: string }
    >;
    driverExamples: ExamplesList<DriverCreateType & { id: string }>;
    addressExamples: ExamplesList<AddressCreateType & { id: string }>;
    cartExamples: ExamplesList<CartItemUpdateType & { id: string }>;
  } {
    return {
      userExamples: this.userExamples,
      restaurantExamples: this.restaurantExamples,
      menuItemExamples: this.menuItemExamples,
      orderExamples: this.orderExamples,
      driverExamples: this.driverExamples,
      addressExamples: this.addressExamples,
      cartExamples: this.cartExamples,
      categoryExamples: this.categoryExamples,
    };
  }
}

// Create and export a singleton instance
export const examples = new Examples();
