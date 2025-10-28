import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface Opportunity {
  id: string;
  title: string;
  organization: string;
  date: string;
  cause: string;
  hours: number;
  latitude?: number;
  longitude?: number;
}

export const useNearbyOpportunities = (radiusKm = 50) => {
  const [nearbyOpportunities, setNearbyOpportunities] = useState<Opportunity[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Ask for user location
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((position) => {
      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  }, []);

  useEffect(() => {
    const fetchOpportunities = async () => {
      if (!userLocation) return;

      const { data: opportunities } = await supabase.from("opportunities").select("*");
      if (!opportunities) return;

      const nearby = opportunities.filter((opp: Opportunity) => {
        if (!opp.latitude || !opp.longitude) return false;
        const distance = getDistanceFromLatLonInMiles(
          userLocation.lat,
          userLocation.lng,
          Number(opp.latitude),
          Number(opp.longitude)
        );
        return distance <= radiusKm;
      });

      setNearbyOpportunities(nearby);
    };

    fetchOpportunities();
  }, [userLocation, radiusKm]);

  return nearbyOpportunities;
};

// Haversine formula to calculate distance in miles
function getDistanceFromLatLonInMiles(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // radius of Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = R * c;
  return distanceKm * 0.621371; // convert to miles
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

