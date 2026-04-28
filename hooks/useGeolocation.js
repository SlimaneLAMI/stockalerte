import { useState, useCallback } from 'react';

export function useGeolocation() {
  const [position, setPosition]   = useState(null);
  const [error, setError]         = useState(null);
  const [loading, setLoading]     = useState(false);

  const locate = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Géolocalisation non supportée');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPosition({ lat: coords.latitude, lng: coords.longitude });
        setError(null);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  return { position, error, loading, locate };
}
