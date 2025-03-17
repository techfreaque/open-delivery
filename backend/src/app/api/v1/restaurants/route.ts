import { restaurantsEndpoint } from "@/client-package/schema/api/v1/restaurant/restaurants";
import { getRestaurants } from "@/lib/api/restaurant/restaurants";
import { apiHandler } from "@/next-portal/api/api-handler";

export const GET = apiHandler({
  endpoint: restaurantsEndpoint,
  handler: getRestaurants,
});
