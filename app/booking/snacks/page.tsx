'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useBookingStore } from '@/lib/store';
import { snacks } from '@/lib/data';
import { Snack, SnackVariant, Addon, CartSnack } from '@/lib/types';
import './page.css';

// Cart Dropdown Component
function CartDropdown({
  cartSnacks,
  removeSnack,
  updateSnackQuantity,
  getSnackTotal,
  isOpen,
  onClose,
}: {
  cartSnacks: CartSnack[];
  removeSnack: (index: number) => void;
  updateSnackQuantity: (index: number, quantity: number) => void;
  getSnackTotal: () => number;
  isOpen: boolean;
  onClose: () => void;
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="bsnacks-cart-dropdown" ref={dropdownRef}>
      <div className="bsnacks-cart-dropdown-header">
        <h3 className="bsnacks-cart-dropdown-title">Your Cart</h3>
        <button onClick={onClose} className="bsnacks-cart-dropdown-close">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {cartSnacks.length === 0 ? (
        <div className="bsnacks-cart-dropdown-empty">
          <p>Your cart is empty</p>
        </div>
      ) : (
        <>
          <div className="bsnacks-cart-dropdown-items">
            {cartSnacks.map((item, index) => (
              <div key={index} className="bsnacks-cart-dropdown-item">
                <div className="bsnacks-cart-dropdown-item-info">
                  <p className="bsnacks-cart-dropdown-item-name">{item.snack.name}</p>
                  <p className="bsnacks-cart-dropdown-item-details">
                    {item.variant.size !== 'regular' && `${item.variant.size} • `}
                    {item.addons.length > 0 && item.addons.map((a) => a.name).join(', ')}
                  </p>
                </div>
                <div className="bsnacks-cart-dropdown-item-controls">
                  <div className="bsnacks-cart-dropdown-qty">
                    <button
                      onClick={() => {
                        if (item.quantity === 1) {
                          removeSnack(index);
                        } else {
                          updateSnackQuantity(index, item.quantity - 1);
                        }
                      }}
                      className="bsnacks-cart-dropdown-qty-btn"
                    >
                      -
                    </button>
                    <span className="bsnacks-cart-dropdown-qty-value">{item.quantity}</span>
                    <button
                      onClick={() => updateSnackQuantity(index, item.quantity + 1)}
                      className="bsnacks-cart-dropdown-qty-btn"
                    >
                      +
                    </button>
                  </div>
                  <p className="bsnacks-cart-dropdown-item-price">
                    ₹{(item.variant.price + item.addons.reduce((s, a) => s + a.price, 0)) * item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="bsnacks-cart-dropdown-footer">
            <div className="bsnacks-cart-dropdown-total">
              <span>Total</span>
              <span className="bsnacks-cart-dropdown-total-value">₹{getSnackTotal()}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const categories = [
  { id: 'all', name: 'All' },
  { id: 'combos', name: 'Combos' },
  { id: 'popcorn', name: 'Popcorn' },
  { id: 'drinks', name: 'Drinks' },
  { id: 'nachos', name: 'Nachos' },
  { id: 'hot_food', name: 'Hot Food' },
];

interface SnackModalProps {
  snack: Snack;
  onClose: () => void;
  onAdd: (item: CartSnack) => void;
}

function SnackModal({ snack, onClose, onAdd }: SnackModalProps) {
  const [selectedVariant, setSelectedVariant] = useState<SnackVariant>(snack.variants[0]);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [quantity, setQuantity] = useState(1);

  const toggleAddon = (addon: Addon) => {
    if (selectedAddons.some((a) => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter((a) => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const getTotal = () => {
    const addonTotal = selectedAddons.reduce((sum, addon) => sum + addon.price, 0);
    return (selectedVariant.price + addonTotal) * quantity;
  };

  const handleAdd = () => {
    onAdd({
      snack,
      variant: selectedVariant,
      addons: selectedAddons,
      quantity,
    });
    onClose();
  };

  return (
    <div className="bsnacks-modal-overlay">
      <div className="bsnacks-modal-backdrop" onClick={onClose} />
      <div className="bsnacks-modal">
        {/* Header */}
        <div className="bsnacks-modal-header">
          <h2 className="bsnacks-modal-title">{snack.name}</h2>
          <button onClick={onClose} className="bsnacks-modal-close">
            <svg className="bsnacks-modal-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="bsnacks-modal-body">
          {/* Image */}
          <div className="bsnacks-modal-image">
            <img src={snack.image} alt={snack.name} />
          </div>

          {/* Description */}
          <p className="bsnacks-modal-desc">{snack.description}</p>

          {/* Variants */}
          {snack.variants.length > 1 && (
            <div>
              <h3 className="bsnacks-modal-section-title">Size</h3>
              <div className="bsnacks-variants">
                {snack.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`bsnacks-variant-btn ${selectedVariant.id === variant.id ? 'active' : ''}`}
                  >
                    <p className="bsnacks-variant-name">{variant.size}</p>
                    <p className="bsnacks-variant-price">₹{variant.price}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Addons */}
          {snack.addons.length > 0 && (
            <div>
              <h3 className="bsnacks-modal-section-title">Add-ons</h3>
              <div className="bsnacks-addons">
                {snack.addons.map((addon) => (
                  <button
                    key={addon.id}
                    onClick={() => toggleAddon(addon)}
                    className={`bsnacks-addon-btn ${selectedAddons.some((a) => a.id === addon.id) ? 'active' : ''}`}
                  >
                    <span>{addon.name}</span>
                    <span className="bsnacks-addon-price">+₹{addon.price}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <h3 className="bsnacks-modal-section-title">Quantity</h3>
            <div className="bsnacks-quantity">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="bsnacks-quantity-btn"
              >
                <svg className="bsnacks-quantity-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="bsnacks-quantity-value">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                className="bsnacks-quantity-btn"
              >
                <svg className="bsnacks-quantity-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bsnacks-modal-footer">
          <button onClick={handleAdd} className="bsnacks-modal-add-btn">
            <span>Add to Cart</span>
            <span className="bsnacks-modal-add-total">₹{getTotal()}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SnacksPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSnack, setSelectedSnack] = useState<Snack | null>(null);
  const [vegOnly, setVegOnly] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const hasCheckedState = useRef(false);

  const {
    selectedMovie,
    selectedTheater,
    selectedShowtime,
    selectedSeats,
    cartSnacks,
    addSnack,
    removeSnack,
    updateSnackQuantity,
    snackPickupTime,
    setSnackPickupTime,
    getTicketTotal,
    getSnackTotal,
  } = useBookingStore();

  // Wait for hydration and store rehydration before checking state
  useEffect(() => {
    // Give the persist middleware time to rehydrate from localStorage
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Only redirect after hydration is complete and we've confirmed no booking data
  useEffect(() => {
    if (isHydrated && !hasCheckedState.current) {
      hasCheckedState.current = true;
      if (!selectedMovie || !selectedTheater || !selectedShowtime || selectedSeats.length === 0) {
        router.push('/');
      }
    }
  }, [isHydrated, selectedMovie, selectedTheater, selectedShowtime, selectedSeats, router]);

  if (!isHydrated || !selectedMovie || !selectedTheater || !selectedShowtime || selectedSeats.length === 0) {
    return (
      <div className="bsnacks-loading">
        <p className="bsnacks-loading-text">Loading...</p>
      </div>
    );
  }

  const filteredSnacks = snacks.filter((snack) => {
    if (selectedCategory !== 'all' && snack.category !== selectedCategory) return false;
    if (vegOnly && !snack.isVeg) return false;
    return true;
  });

  const handleProceed = () => {
    router.push('/booking/checkout');
  };

  const handleSkip = () => {
    router.push('/booking/checkout');
  };

  const cartItemCount = cartSnacks.length;

  return (
    <div className="bsnacks-page">
      {/* Header */}
      <div className="bsnacks-header">
        <div>
          <h1 className="bsnacks-title">Add Snacks</h1>
          <p className="bsnacks-subtitle">Skip the queue - Pre-order your snacks!</p>
        </div>
        <div className="bsnacks-header-actions">
          {/* Cart Toggle Button */}
          <div className="bsnacks-cart-container">
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="bsnacks-cart-toggle"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartItemCount > 0 && (
                <span className="bsnacks-cart-badge">{cartItemCount}</span>
              )}
            </button>
            <CartDropdown
              cartSnacks={cartSnacks}
              removeSnack={removeSnack}
              updateSnackQuantity={updateSnackQuantity}
              getSnackTotal={getSnackTotal}
              isOpen={isCartOpen}
              onClose={() => setIsCartOpen(false)}
            />
          </div>
          <button onClick={handleSkip} className="bsnacks-skip-btn">
            Skip & Continue
          </button>
        </div>
      </div>

      {/* Booking Summary */}
      <div className="bsnacks-card">
        <div className="bsnacks-summary">
          <div className="bsnacks-summary-item">
            <span className="bsnacks-summary-label">Movie:</span>
            <span className="bsnacks-summary-value">{selectedMovie.title}</span>
          </div>
          <span className="bsnacks-summary-divider">|</span>
          <div className="bsnacks-summary-item">
            <span className="bsnacks-summary-label">Seats:</span>
            <span className="bsnacks-summary-value">{selectedSeats.map((s) => s.id).join(', ')}</span>
          </div>
          <span className="bsnacks-summary-divider">|</span>
          <div className="bsnacks-summary-item">
            <span className="bsnacks-summary-label">Tickets:</span>
            <span className="bsnacks-summary-value">₹{getTicketTotal()}</span>
          </div>
        </div>
      </div>

      {/* Pickup Time */}
      <div className="bsnacks-card">
        <h3 className="bsnacks-pickup-title">When do you want to pick up your snacks?</h3>
        <div className="bsnacks-pickup-options">
          <button
            onClick={() => setSnackPickupTime('pre-show')}
            className={`bsnacks-pickup-btn ${snackPickupTime === 'pre-show' ? 'active' : ''}`}
          >
            <svg className="bsnacks-pickup-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="bsnacks-pickup-name">Before Movie</p>
            <p className="bsnacks-pickup-desc">Pick up 15 mins before showtime</p>
          </button>
          <button
            onClick={() => setSnackPickupTime('interval')}
            className={`bsnacks-pickup-btn ${snackPickupTime === 'interval' ? 'active' : ''}`}
          >
            <svg className="bsnacks-pickup-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p className="bsnacks-pickup-name">During Interval</p>
            <p className="bsnacks-pickup-desc">Ready at interval time</p>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bsnacks-filters">
        <div className="bsnacks-categories">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`bsnacks-category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <button
          onClick={() => setVegOnly(!vegOnly)}
          className={`bsnacks-veg-btn ${vegOnly ? 'active' : ''}`}
        >
          <div className="bsnacks-veg-icon">
            <div className="bsnacks-veg-dot"></div>
          </div>
          Veg Only
        </button>
      </div>

      {/* Popular Section */}
      {selectedCategory === 'all' && (
        <section className="bsnacks-section">
          <h2 className="bsnacks-section-title">Popular</h2>
          <div className="bsnacks-grid">
            {snacks.filter((s) => s.isPopular && (!vegOnly || s.isVeg)).slice(0, 3).map((snack) => (
              <div key={snack.id} className="bsnacks-item">
                <div className="bsnacks-item-image">
                  <img src={snack.image} alt={snack.name} />
                </div>
                <div className="bsnacks-item-content">
                  <div className="bsnacks-item-header">
                    <h3 className="bsnacks-item-name">{snack.name}</h3>
                    <div className={`bsnacks-veg-badge ${snack.isVeg ? 'veg' : 'non-veg'}`}>
                      <div className="bsnacks-veg-badge-dot"></div>
                    </div>
                  </div>
                  <p className="bsnacks-item-desc">{snack.description}</p>
                  <div className="bsnacks-item-footer">
                    <span className="bsnacks-item-price">₹{snack.variants[0].price}</span>
                    <button
                      onClick={() => setSelectedSnack(snack)}
                      className="bsnacks-add-btn"
                    >
                      ADD +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Snacks */}
      <section className="bsnacks-section">
        <h2 className="bsnacks-section-title">
          {selectedCategory === 'all' ? 'All Items' : categories.find((c) => c.id === selectedCategory)?.name}
        </h2>
        <div className="bsnacks-grid">
          {filteredSnacks.map((snack) => (
            <div key={snack.id} className="bsnacks-item">
              <div className="bsnacks-item-image">
                <img src={snack.image} alt={snack.name} />
              </div>
              <div className="bsnacks-item-content">
                <div className="bsnacks-item-header">
                  <h3 className="bsnacks-item-name">{snack.name}</h3>
                  <div className={`bsnacks-veg-badge ${snack.isVeg ? 'veg' : 'non-veg'}`}>
                    <div className="bsnacks-veg-badge-dot"></div>
                  </div>
                </div>
                <p className="bsnacks-item-desc">{snack.description}</p>
                <div className="bsnacks-item-footer">
                  <span className="bsnacks-item-price">₹{snack.variants[0].price}</span>
                  <button
                    onClick={() => setSelectedSnack(snack)}
                    className="bsnacks-add-btn"
                  >
                    ADD +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Bar */}
      <div className="bsnacks-bottom-bar">
        <div className="bsnacks-bottom-content">
          <div className="bsnacks-bottom-info">
            <div className="bsnacks-bottom-item">
              <p className="bsnacks-bottom-label">Tickets ({selectedSeats.length})</p>
              <p className="bsnacks-bottom-value">₹{getTicketTotal()}</p>
            </div>
            {cartSnacks.length > 0 && (
              <div className="bsnacks-bottom-item">
                <p className="bsnacks-bottom-label">Snacks ({cartSnacks.reduce((s, i) => s + i.quantity, 0)})</p>
                <p className="bsnacks-bottom-value">₹{getSnackTotal()}</p>
              </div>
            )}
            <div className="bsnacks-bottom-item">
              <p className="bsnacks-bottom-label">Sub Total</p>
              <p className="bsnacks-bottom-total">₹{getTicketTotal() + getSnackTotal()}</p>
            </div>
          </div>
          <div className="bsnacks-bottom-actions">
            <button onClick={() => router.back()} className="bsnacks-back-btn">
              Back
            </button>
            <button onClick={handleProceed} className="bsnacks-proceed-btn">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

      {/* Snack Modal */}
      {selectedSnack && (
        <SnackModal
          snack={selectedSnack}
          onClose={() => setSelectedSnack(null)}
          onAdd={(item) => addSnack(item)}
        />
      )}
    </div>
  );
}
