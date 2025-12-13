'use client';

import { useState, useEffect, useRef } from 'react';
import { useBookingStore } from '@/lib/store';
import { City } from '@/lib/types';
import './CityModal.css';

interface CityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Your two theater locations
const theaterLocations: City[] = [
  { id: '1', name: 'Anthiyur', state: 'Tamil Nadu' },
  { id: '2', name: 'Komarapalayam', state: 'Tamil Nadu' },
];

export default function CityModal({ isOpen, onClose }: CityModalProps) {
  const [isDetecting, setIsDetecting] = useState(false);
  const { setSelectedCity, selectedCity } = useBookingStore();
  const modalRef = useRef<HTMLDivElement>(null);

  // Scroll modal to top when it opens
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.scrollTop = 0;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    onClose();
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsDetecting(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Approximate coordinates for the two locations
        const locations = [
          { city: theaterLocations[0], lat: 8.7139, lng: 77.7567 }, // Tirunelveli
          { city: theaterLocations[1], lat: 8.9604, lng: 77.3152 }, // Tenkasi
        ];

        // Find nearest location
        let nearest = locations[0];
        let minDistance = Number.MAX_VALUE;

        locations.forEach((loc) => {
          const distance = Math.sqrt(
            Math.pow(latitude - loc.lat, 2) + Math.pow(longitude - loc.lng, 2)
          );
          if (distance < minDistance) {
            minDistance = distance;
            nearest = loc;
          }
        });

        setSelectedCity(nearest.city);
        setIsDetecting(false);
        onClose();
      },
      (error) => {
        setIsDetecting(false);
        alert('Unable to detect location. Please select manually.');
        console.error('Geolocation error:', error);
      },
      { timeout: 10000 }
    );
  };

  return (
    <div className="city-modal-overlay">
      {/* Backdrop */}
      <div className="city-modal-backdrop" onClick={onClose} />

      {/* Modal */}
      <div className="city-modal city-modal-compact" ref={modalRef}>
        {/* Header */}
        <div className="city-modal-header">
          <h2 className="city-modal-title">Select Location</h2>
          <button onClick={onClose} className="city-modal-close">
            <svg className="city-modal-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Theater Locations Grid */}
        <div className="city-modal-content">
          <div className="city-modal-locations">
            <h3 className="city-modal-section-title">Our Theaters</h3>
            <div className="city-modal-locations-grid">
              {theaterLocations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => handleCitySelect(location)}
                  className={`city-modal-location-btn ${selectedCity?.id === location.id ? 'selected' : ''}`}
                >
                  <div className="city-modal-location-icon-wrapper">
                    <svg className="city-modal-location-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <span className="city-modal-location-name">{location.name}</span>
                  <span className="city-modal-location-state">{location.state}</span>
                  {selectedCity?.id === location.id && (
                    <div className="city-modal-location-check">
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Detect Location */}
        <div className="city-modal-detect">
          <button
            className="city-modal-detect-btn"
            onClick={handleDetectLocation}
            disabled={isDetecting}
          >
            {isDetecting ? (
              <>
                <div className="city-modal-detect-spinner"></div>
                <span className="city-modal-detect-text">Detecting...</span>
              </>
            ) : (
              <>
                <svg className="city-modal-detect-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="city-modal-detect-text">Detect My Location</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
