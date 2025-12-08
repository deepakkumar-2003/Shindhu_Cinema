'use client';

import { useState } from 'react';
import { snacks } from '@/lib/data';
import './page.css';

const categories = [
  { id: 'all', name: 'All' },
  { id: 'combos', name: 'Combos' },
  { id: 'popcorn', name: 'Popcorn' },
  { id: 'drinks', name: 'Drinks' },
  { id: 'nachos', name: 'Nachos' },
  { id: 'hot_food', name: 'Hot Food' },
];

export default function SnacksPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [vegOnly, setVegOnly] = useState(false);

  const filteredSnacks = snacks.filter((snack) => {
    if (selectedCategory !== 'all' && snack.category !== selectedCategory) return false;
    if (vegOnly && !snack.isVeg) return false;
    return true;
  });

  return (
    <div className="snacks-page">
      {/* Hero */}
      <div className="snacks-hero">
        <h1 className="snacks-hero-title">Food & Beverages</h1>
        <p className="snacks-hero-subtitle">
          Pre-order your snacks and skip the queue! Your order will be ready for pickup at the counter.
        </p>
      </div>

      {/* Filters */}
      <div className="snacks-filters">
        <div className="snacks-category-filters">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`snacks-category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <button
          onClick={() => setVegOnly(!vegOnly)}
          className={`snacks-veg-btn ${vegOnly ? 'active' : ''}`}
        >
          <div className="snacks-veg-icon">
            <div className="snacks-veg-icon-inner"></div>
          </div>
          Veg Only
        </button>
      </div>

      {/* Info Banner */}
      <div className="snacks-info-banner">
        <div className="snacks-info-content">
          <div className="snacks-info-icon-wrapper">
            <svg className="snacks-info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="snacks-info-text">
            <h3 className="snacks-info-title">How it works</h3>
            <p className="snacks-info-description">
              Add snacks while booking tickets, select your pickup time (before show or during interval),
              and collect from the counter by showing your QR code!
            </p>
          </div>
        </div>
      </div>

      {/* Popular Items */}
      {selectedCategory === 'all' && (
        <section className="snacks-popular-section">
          <h2 className="snacks-section-title">Popular Items</h2>
          <div className="snacks-popular-grid">
            {snacks.filter((s) => s.isPopular && (!vegOnly || s.isVeg)).map((snack) => (
              <div key={snack.id} className="snacks-popular-card">
                <div className="snacks-popular-image-wrapper">
                  <img src={snack.image} alt={snack.name} className="snacks-popular-image" />
                </div>
                <div className="snacks-popular-content">
                  <div className="snacks-popular-header">
                    <h3 className="snacks-popular-name">{snack.name}</h3>
                    <div className={`snacks-veg-indicator ${snack.isVeg ? 'veg' : 'non-veg'}`}>
                      <div className="snacks-veg-indicator-dot"></div>
                    </div>
                  </div>
                  <p className="snacks-popular-description">{snack.description}</p>
                  <div className="snacks-popular-footer">
                    <div>
                      <span className="snacks-popular-price">₹{snack.variants[0].price}</span>
                      {snack.variants.length > 1 && (
                        <span className="snacks-popular-price-suffix">onwards</span>
                      )}
                    </div>
                    <span className="snacks-popular-badge">Popular</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Items */}
      <section>
        <h2 className="snacks-section-title">
          {selectedCategory === 'all' ? 'All Items' : categories.find((c) => c.id === selectedCategory)?.name}
        </h2>
        <div className="snacks-all-grid">
          {filteredSnacks.map((snack) => (
            <div key={snack.id} className="snacks-card">
              <div className="snacks-card-image-wrapper">
                <img src={snack.image} alt={snack.name} className="snacks-card-image" />
              </div>
              <div className="snacks-card-header">
                <h3 className="snacks-card-name">{snack.name}</h3>
                <div className={`snacks-card-veg-indicator ${snack.isVeg ? 'veg' : 'non-veg'}`}>
                  <div className="snacks-card-veg-dot"></div>
                </div>
              </div>
              <p className="snacks-card-description">{snack.description}</p>

              {/* Variants */}
              {snack.variants.length > 1 ? (
                <div className="snacks-card-variants">
                  {snack.variants.map((variant) => (
                    <span key={variant.id} className="snacks-card-variant">
                      {variant.size}: ₹{variant.price}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="snacks-card-price">₹{snack.variants[0].price}</p>
              )}

              {/* Addons */}
              {snack.addons.length > 0 && (
                <p className="snacks-card-addons">
                  Add-ons: {snack.addons.map((a) => a.name).join(', ')}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {filteredSnacks.length === 0 && (
        <div className="snacks-empty">
          <p className="snacks-empty-text">No items found</p>
        </div>
      )}
    </div>
  );
}
