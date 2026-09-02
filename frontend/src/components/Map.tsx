import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import './Map.css';

declare const google: any;

// Vite environment variable for Google Maps API key
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string || 'YOUR_GOOGLE_MAPS_API_KEY';

// Sample sightseeing nodes (expandable later)
const sights = [
  { name: 'Darjeeling Tea Gardens', lat: 27.0360, lng: 88.2625 },
  { name: 'Tiger Hill', lat: 27.0270, lng: 88.2667 },
  { name: 'Batasia Loop', lat: 27.0365, lng: 88.2650 },
];

export default function Map() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['visualization'],
    });
    // @ts-ignore – loader.load exists in runtime
    loader.load().then(() => {
      if (!mapRef.current) return;
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 27.0330, lng: 88.2620 },
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        tilt: 45,
      });

      // Add sightseeing markers
      sights.forEach((s) => {
        new google.maps.Marker({
          position: { lat: s.lat, lng: s.lng },
          map,
          title: s.name,
        });
      });

      // Mock altitude polyline
      const altitudePath = sights.map((s) => ({ lat: s.lat, lng: s.lng }));
      new google.maps.Polyline({
        path: altitudePath,
        geodesic: true,
        strokeColor: '#ff6600',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        map,
      });
    });
  }, []);

  return <div ref={mapRef} className="map-container" />;
}
