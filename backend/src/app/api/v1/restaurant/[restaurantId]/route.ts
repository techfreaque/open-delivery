import {
  restaurantCreateEndpoint,
  restaurantGetEndpoint,
  restaurantUpdateEndpoint,
} from "@/client-package/schema/api/v1/restaurant/restaurant";
import {
  createRestaurant,
  getRestaurant,
  updateRestaurant,
} from "@/lib/api/restaurant/restaurant";
import { apiHandler } from "@/next-portal/api/api-handler";

export const GET = apiHandler({
  endpoint: restaurantGetEndpoint,
  handler: getRestaurant,
});

export const POST = apiHandler({
  endpoint: restaurantCreateEndpoint,
  handler: createRestaurant,
});

export const PUT = apiHandler({
  endpoint: restaurantUpdateEndpoint,
  handler: updateRestaurant,
});
