'use client';

import { useState } from 'react';
import { useBookingStore } from '@/lib/store';
import { cities } from '@/lib/data';
import { City } from '@/lib/types';
import './CityModal.css';

interface CityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CityModal({ isOpen, onClose }: CityModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { setSelectedCity, selectedCity } = useBookingStore();

  if (!isOpen) return null;

  const filteredCities = cities.filter(
    (city) =>
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const popularCities = cities.slice(0, 6);

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    onClose();
  };

  return (
    <div className="city-modal-overlay">
      {/* Backdrop */}
      <div className="city-modal-backdrop" onClick={onClose} />

      {/* Modal */}
      <div className="city-modal">
        {/* Header */}
        <div className="city-modal-header">
          <h2 className="city-modal-title">Select Your City</h2>
          <button onClick={onClose} className="city-modal-close">
            <svg className="city-modal-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="city-modal-search">
          <div className="city-modal-search-wrapper">
            <input
              type="text"
              placeholder="Search for your city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="city-modal-search-input"
              autoFocus
            />
            <svg
              className="city-modal-search-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Scrollable Content - Popular Cities and All Cities */}
        <div className="city-modal-content">
          {/* Popular Cities */}
          {!searchQuery && (
            <div className="city-modal-popular">
              <h3 className="city-modal-section-title">Popular Cities</h3>
              <div className="city-modal-popular-grid">
                {popularCities.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => handleCitySelect(city)}
                    className={`city-modal-popular-btn ${selectedCity?.id === city.id ? 'selected' : ''}`}
                  >
                    <div className="city-modal-popular-icon-wrapper">
                      <svg className="city-modal-popular-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <span className="city-modal-popular-name">{city.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* All Cities / Search Results */}
          <div className="city-modal-list">
            <h3 className="city-modal-section-title">
              {searchQuery ? 'Search Results' : 'All Cities'}
            </h3>
            <div className="city-modal-list-items">
              {filteredCities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => handleCitySelect(city)}
                  className={`city-modal-list-btn ${selectedCity?.id === city.id ? 'selected' : ''}`}
                >
                  <div className="city-modal-list-content">
                    <svg className="city-modal-list-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <div className="city-modal-list-info">
                      <p className="city-modal-list-name">{city.name}</p>
                      <p className="city-modal-list-state">{city.state}</p>
                    </div>
                  </div>
                  {selectedCity?.id === city.id && (
                    <svg className="city-modal-list-check" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  )}
                </button>
              ))}
              {filteredCities.length === 0 && (
                <p className="city-modal-no-results">No cities found</p>
              )}
            </div>
          </div>
        </div>

        {/* Detect Location */}
        <div className="city-modal-detect">
          <button className="city-modal-detect-btn">
            <svg className="city-modal-detect-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="city-modal-detect-text">Detect My Location</span>
          </button>
        </div>
      </div>
    </div>
  );
}
