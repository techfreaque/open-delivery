import { Client } from "@googlemaps/google-maps-services-js";

import { env } from "../env";
import { errorLogger } from "../utils";

/**
 * Calculate the distance between two geographical coordinates using the Haversine formula
 * @param lat1 Latitude of the first point in decimal degrees
 * @param lon1 Longitude of the first point in decimal degrees
 * @param lat2 Latitude of the second point in decimal degrees
 * @param lon2 Longitude of the second point in decimal degrees
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  // Convert degrees to radians
  const toRadians = (degrees: number): number => degrees * (Math.PI / 180);
  const radiusOfEarth = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = radiusOfEarth * c;
  return distance;
}

export async function getCoordinatesFromAddress({
  street,
  streetNumber,
  zip,
  city,
  country,
}: {
  street?: string;
  streetNumber?: string;
  zip?: string;
  city?: string;
  country?: string;
}): Promise<{ latitude: number; longitude: number } | { error: string }> {
  const client = new Client({});
  const addressParts = [];
  if (street) {
    addressParts.push(street);
  }
  if (streetNumber) {
    addressParts.push(streetNumber);
  }
  if (zip) {
    addressParts.push(zip);
  }
  if (city) {
    addressParts.push(city);
  }
  if (country) {
    addressParts.push(country);
  }
  const address = addressParts.join(", ");
  if (!address) {
    return { error: "At least one address component is required" };
  }
  try {
    const response = await client.geocode({
      params: {
        address,
        key: env.GOOGLE_MAPS_API_KEY,
      },
    });
    if (response.data.results.length === 0) {
      throw new Error("No results found for the provided address");
    }
    const { lat, lng } = response.data.results[0].geometry.location;
    return { latitude: lat, longitude: lng };
  } catch (error) {
    errorLogger("Error geocoding address:", error);
    return { error: "Failed to geocode address" };
  }
}
