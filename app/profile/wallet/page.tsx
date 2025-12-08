'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUserStore } from '@/lib/store';
import './page.css';

const transactions = [
  { id: '1', type: 'credit', amount: 100, description: 'Referral bonus', date: '2024-12-01' },
  { id: '2', type: 'debit', amount: 50, description: 'Movie booking - Pushpa 2', date: '2024-11-28' },
  { id: '3', type: 'credit', amount: 50, description: 'Signup bonus', date: '2024-11-25' },
  { id: '4', type: 'credit', amount: 200, description: 'Added money', date: '2024-11-20' },
  { id: '5', type: 'debit', amount: 100, description: 'Movie booking - Dune', date: '2024-11-15' },
];

export default function WalletPage() {
  const router = useRouter();
  const { isAuthenticated, user, setUser } = useUserStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleAddMoney = () => {
    const addAmount = parseInt(amount);
    if (addAmount > 0) {
      setUser({
        ...user,
        walletBalance: user.walletBalance + addAmount,
      });
      setShowAddModal(false);
      setAmount('');
    }
  };

  return (
    <div className="wallet-page">
      <div className="wallet-header">
        <Link href="/profile" className="wallet-back-link">
          <svg className="wallet-back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="wallet-title">Wallet</h1>
      </div>

      {/* Balance Card */}
      <div className="wallet-balance-card">
        <div className="wallet-balance-content">
          <div className="wallet-balance-info">
            <p className="wallet-balance-label">Available Balance</p>
            <p className="wallet-balance-amount">₹{user.walletBalance}</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="wallet-add-btn"
          >
            <svg className="wallet-add-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Money
          </button>
        </div>
      </div>

      {/* Quick Add */}
      <div className="wallet-card">
        <h2 className="wallet-card-title">Quick Add</h2>
        <div className="wallet-quick-add-grid">
          {[100, 200, 500, 1000].map((value) => (
            <button
              key={value}
              onClick={() => {
                setUser({
                  ...user,
                  walletBalance: user.walletBalance + value,
                });
              }}
              className="wallet-quick-add-btn"
            >
              <p className="wallet-quick-add-amount">₹{value}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div className="wallet-card">
        <h2 className="wallet-card-title">Transaction History</h2>
        <div className="wallet-transactions">
          {transactions.map((txn) => (
            <div key={txn.id} className="wallet-transaction-item">
              <div className="wallet-transaction-left">
                <div className={`wallet-transaction-icon ${txn.type}`}>
                  {txn.type === 'credit' ? (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  ) : (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="wallet-transaction-description">{txn.description}</p>
                  <p className="wallet-transaction-date">
                    {new Date(txn.date).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <p className={`wallet-transaction-amount ${txn.type}`}>
                {txn.type === 'credit' ? '+' : '-'}₹{txn.amount}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="wallet-info-section">
        <h3 className="wallet-info-title">About Shindhu Wallet</h3>
        <ul className="wallet-info-list">
          <li className="wallet-info-item">
            <svg className="wallet-info-check" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            Use wallet balance for instant payments
          </li>
          <li className="wallet-info-item">
            <svg className="wallet-info-check" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            Earn cashback on bookings
          </li>
          <li className="wallet-info-item">
            <svg className="wallet-info-check" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            Refer friends and earn ₹100 per referral
          </li>
          <li className="wallet-info-item">
            <svg className="wallet-info-check" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            Wallet balance never expires
          </li>
        </ul>
      </div>

      {/* Add Money Modal */}
      {showAddModal && (
        <div className="wallet-modal-overlay">
          <div className="wallet-modal-backdrop" onClick={() => setShowAddModal(false)} />
          <div className="wallet-modal">
            <div className="wallet-modal-header">
              <h2 className="wallet-modal-title">Add Money</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="wallet-modal-close"
              >
                <svg className="wallet-modal-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="wallet-modal-body">
              <div className="wallet-modal-form-group">
                <label className="wallet-modal-label">Enter Amount</label>
                <div className="wallet-modal-input-wrapper">
                  <span className="wallet-modal-currency">₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="wallet-modal-input"
                    min="1"
                  />
                </div>
              </div>
              <div className="wallet-modal-quick-grid">
                {[100, 200, 500, 1000].map((value) => (
                  <button
                    key={value}
                    onClick={() => setAmount(value.toString())}
                    className="wallet-modal-quick-btn"
                  >
                    ₹{value}
                  </button>
                ))}
              </div>
              <button
                onClick={handleAddMoney}
                disabled={!amount || parseInt(amount) <= 0}
                className="wallet-modal-submit"
              >
                Add ₹{amount || '0'} to Wallet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
