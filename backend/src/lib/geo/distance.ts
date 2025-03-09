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
  const toRadians = (degrees: number) => degrees * (Math.PI / 180);

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
}): Promise<{ latitude: number; longitude: number }> {
  // TODO use the Google Maps Geocoding API
  // https://developers.google.com/maps/documentation/geocoding/overview
  return { latitude: 0, longitude: 0 };
}
