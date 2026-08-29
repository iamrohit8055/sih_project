import { useEffect, useState } from "react";

import type { FarmLocation } from "@/types/logistics";

function useFarmLocation() {
  const [farmLocation, setFarmLocation] =
    useState<FarmLocation | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!navigator.geolocation) {
      setError(
        "Location services are not supported by your browser."
      );

      setLoading(false);

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFarmLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setLoading(false);
      },

      (error) => {
        console.error(
          "Unable to get farmer location:",
          error
        );

        setError(
          "Unable to access your location. Please allow location access."
        );

        setLoading(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, []);

  return {
    farmLocation,
    setFarmLocation,
    loading,
    error,
  };
}

export default useFarmLocation;