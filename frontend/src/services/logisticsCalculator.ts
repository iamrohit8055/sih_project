import type {
  Coordinates,
  Transporter,
} from "@/types/logistics";

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

export function calculateDistanceKm(
  from: Coordinates,
  to: Coordinates
): number {
  const earthRadiusKm = 6371;

  const latitudeDifference =
    toRadians(to.latitude - from.latitude);

  const longitudeDifference =
    toRadians(to.longitude - from.longitude);

  const a =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(toRadians(from.latitude)) *
      Math.cos(toRadians(to.latitude)) *
      Math.sin(longitudeDifference / 2) ** 2;

  const c =
    2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
}


export function estimateTransportCost(
  transporter: Transporter,
  distanceKm: number
): number {
  const baseFare = 500;

  return Math.round(
    baseFare +
      distanceKm * transporter.vehicle.pricePerKm
  );
}