import { useState, useEffect, useRef } from 'react';
import { appendHistory } from '../services/historyStorage';

export function useGeolocation(isActive) {
  const [hasPermission, setHasPermission] = useState(null); // null = unknown, true = granted, false = denied
  const [currentPosition, setCurrentPosition] = useState(null);
  const watchIdRef = useRef(null);

  useEffect(() => {
    // Determine initial permission state without prompting
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then(result => {
        if (result.state === 'granted') setHasPermission(true);
        else if (result.state === 'denied') setHasPermission(false);
        // if prompt, keep it null until they request
      });
    }
  }, []);

  useEffect(() => {
    if (!isActive) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      return;
    }

    if (!('geolocation' in navigator)) {
      setHasPermission(false);
      return;
    }

    // Start tracking if active
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        setHasPermission(true);
        const point = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: position.timestamp,
        };
        setCurrentPosition(point);
        appendHistory(point);
      },
      (error) => {
        console.warn("Geolocation error:", error);
        setHasPermission(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000,
      }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [isActive]);

  return { hasPermission, currentPosition };
}
