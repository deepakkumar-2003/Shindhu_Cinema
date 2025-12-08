'use client';

import { useState } from 'react';
import './page.css';

const offers = [
  {
    id: '1',
    title: 'First Booking Offer',
    code: 'FIRST20',
    description: 'Get 20% off on your first movie booking',
    discount: '20% OFF',
    maxDiscount: 150,
    minPurchase: 200,
    validTill: '2025-01-31',
    terms: [
      'Valid for first-time users only',
      'Maximum discount of ₹150',
      'Cannot be combined with other offers',
      'Valid on all movies and showtimes',
    ],
    category: 'new_user',
    cardStyle: 'offers-card-primary',
  },
  {
    id: '2',
    title: 'Combo Deal',
    code: 'COMBO30',
    description: 'Get 30% off when you book tickets + snacks together',
    discount: '30% OFF',
    maxDiscount: 200,
    minPurchase: 500,
    validTill: '2025-02-28',
    terms: [
      'Valid on combined ticket + snack orders',
      'Minimum order value ₹500',
      'Maximum discount of ₹200',
      'Valid once per user per day',
    ],
    category: 'combo',
    cardStyle: 'offers-card-accent',
  },
  {
    id: '3',
    title: 'Weekend Special',
    code: 'WEEKEND15',
    description: 'Flat 15% off on weekend bookings',
    discount: '15% OFF',
    maxDiscount: 100,
    minPurchase: 300,
    validTill: '2025-03-31',
    terms: [
      'Valid only on Saturday and Sunday',
      'Applicable on all shows',
      'Cannot be combined with other offers',
      'Valid for all users',
    ],
    category: 'weekend',
    cardStyle: 'offers-card-success',
  },
  {
    id: '4',
    title: 'Student Discount',
    code: 'STUDENT10',
    description: 'Students get 10% off with valid ID',
    discount: '10% OFF',
    maxDiscount: 75,
    minPurchase: 0,
    validTill: '2025-12-31',
    terms: [
      'Valid student ID required at entry',
      'Applicable on weekday shows only',
      'Not valid on premium/VIP seats',
      'One booking per student ID per day',
    ],
    category: 'student',
    cardStyle: 'offers-card-blue',
  },
  {
    id: '5',
    title: 'Family Pack',
    code: 'FAMILY25',
    description: 'Book 4+ tickets and get 25% off',
    discount: '25% OFF',
    maxDiscount: 300,
    minPurchase: 800,
    validTill: '2025-06-30',
    terms: [
      'Minimum 4 tickets required',
      'Maximum discount of ₹300',
      'Valid on all showtimes',
      'Can be used once per day',
    ],
    category: 'family',
    cardStyle: 'offers-card-purple',
  },
  {
    id: '6',
    title: 'Morning Show',
    code: 'MORNING40',
    description: 'Flat 40% off on shows before 12 PM',
    discount: '40% OFF',
    maxDiscount: 200,
    minPurchase: 200,
    validTill: '2025-04-30',
    terms: [
      'Valid on shows starting before 12 PM',
      'All days of the week',
      'Maximum discount of ₹200',
      'Not valid on premiere shows',
    ],
    category: 'morning',
    cardStyle: 'offers-card-orange',
  },
];

const categories = [
  { id: 'all', name: 'All Offers' },
  { id: 'new_user', name: 'New Users' },
  { id: 'combo', name: 'Combos' },
  { id: 'weekend', name: 'Weekend' },
  { id: 'student', name: 'Students' },
  { id: 'family', name: 'Family' },
];

export default function OffersPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const filteredOffers = offers.filter(
    (offer) => selectedCategory === 'all' || offer.category === selectedCategory
  );

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="offers-page">
      {/* Hero */}
      <div className="offers-hero">
        <h1 className="offers-hero-title">Offers & Promotions</h1>
        <p className="offers-hero-subtitle">
          Save more on your movie experience with our exclusive deals and discounts!
        </p>
      </div>

      {/* Category Filter */}
      <div className="offers-category-filters">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`offers-category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Offers Grid */}
      <div className="offers-grid">
        {filteredOffers.map((offer) => (
          <div
            key={offer.id}
            className={`offers-card ${offer.cardStyle}`}
          >
            <div className="offers-card-header">
              <div>
                <h3 className="offers-card-title">{offer.title}</h3>
                <p className="offers-card-description">{offer.description}</p>
              </div>
              <span className="offers-card-discount">
                {offer.discount}
              </span>
            </div>

            {/* Code */}
            <div className="offers-code-section">
              <div className="offers-code-box">
                <span className="offers-code-text">{offer.code}</span>
              </div>
              <button
                onClick={() => handleCopyCode(offer.code)}
                className="offers-copy-btn"
              >
                {copiedCode === offer.code ? 'Copied!' : 'Copy'}
              </button>
            </div>

            {/* Details */}
            <div className="offers-details">
              <div className="offers-detail-row">
                <span className="offers-detail-label">Max Discount</span>
                <span className="offers-detail-value">₹{offer.maxDiscount}</span>
              </div>
              {offer.minPurchase > 0 && (
                <div className="offers-detail-row">
                  <span className="offers-detail-label">Min Purchase</span>
                  <span className="offers-detail-value">₹{offer.minPurchase}</span>
                </div>
              )}
              <div className="offers-detail-row">
                <span className="offers-detail-label">Valid Till</span>
                <span className="offers-detail-value">
                  {new Date(offer.validTill).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* Terms */}
            <details className="offers-terms">
              <summary className="offers-terms-summary">
                Terms & Conditions
              </summary>
              <ul className="offers-terms-list">
                {offer.terms.map((term, index) => (
                  <li key={index} className="offers-terms-item">
                    <span>•</span>
                    <span>{term}</span>
                  </li>
                ))}
              </ul>
            </details>
          </div>
        ))}
      </div>

      {filteredOffers.length === 0 && (
        <div className="offers-empty">
          <p className="offers-empty-text">No offers available in this category</p>
        </div>
      )}

      {/* Refer & Earn Section */}
      <section className="offers-refer-section">
        <div className="offers-refer-card">
          <div className="offers-refer-icon-wrapper">
            <svg className="offers-refer-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="offers-refer-title">Refer & Earn ₹100</h2>
          <p className="offers-refer-description">
            Invite your friends to Shindhu Cinemas and earn ₹100 wallet credit for each successful referral.
            Your friend gets ₹50 too!
          </p>
          <button className="offers-refer-btn">
            Start Referring
          </button>
        </div>
      </section>

      {/* Bank Offers */}
      <section className="offers-bank-section">
        <h2 className="offers-bank-title">Bank Offers</h2>
        <div className="offers-bank-grid">
          {[
            { bank: 'HDFC Bank', discount: '10% off', card: 'Credit Cards' },
            { bank: 'ICICI Bank', discount: '15% off', card: 'Debit Cards' },
            { bank: 'Axis Bank', discount: '₹100 off', card: 'All Cards' },
            { bank: 'SBI Card', discount: '10% off', card: 'Credit Cards' },
          ].map((bankOffer, index) => (
            <div key={index} className="offers-bank-card">
              <p className="offers-bank-name">{bankOffer.bank}</p>
              <p className="offers-bank-discount">{bankOffer.discount}</p>
              <p className="offers-bank-card-type">{bankOffer.card}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
