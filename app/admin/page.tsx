'use client';

import { useState } from 'react';
import { movies, theaters, snacks } from '@/lib/data';

const tabs = ['Dashboard', 'Movies', 'Showtimes', 'Snacks', 'Bookings', 'Reports'];

// Sample stats
const stats = {
  todayBookings: 156,
  todayRevenue: 45890,
  activeShows: 24,
  occupancyRate: 68,
};

// Sample recent bookings
const recentBookings = [
  { id: 'SHC001', movie: 'Pushpa 2', seats: 2, amount: 980, time: '2 mins ago' },
  { id: 'SHC002', movie: 'Dune: Part Two', seats: 4, amount: 1850, time: '5 mins ago' },
  { id: 'SHC003', movie: 'Stree 2', seats: 3, amount: 750, time: '12 mins ago' },
  { id: 'SHC004', movie: 'Kalki 2898 AD', seats: 2, amount: 1100, time: '18 mins ago' },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Today&apos;s Bookings</p>
              <p className="text-3xl font-bold">{stats.todayBookings}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-success mt-2">+12% from yesterday</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Today&apos;s Revenue</p>
              <p className="text-3xl font-bold">₹{stats.todayRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-success mt-2">+8% from yesterday</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Active Shows</p>
              <p className="text-3xl font-bold">{stats.activeShows}</p>
            </div>
            <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            </div>
          </div>
          <p className="text-sm text-muted mt-2">Across 5 theaters</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Occupancy Rate</p>
              <p className="text-3xl font-bold">{stats.occupancyRate}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="w-full bg-secondary rounded-full h-2 mt-3">
            <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${stats.occupancyRate}%` }}></div>
          </div>
        </div>
      </div>

      {/* Recent Bookings & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="font-medium">{booking.movie}</p>
                  <p className="text-sm text-muted">{booking.seats} seats • {booking.time}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">₹{booking.amount}</p>
                  <p className="text-xs text-muted">#{booking.id}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-primary text-sm font-medium hover:underline">
            View All Bookings
          </button>
        </div>

        {/* Quick Actions */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-secondary rounded-lg hover:bg-card-hover transition-colors text-left">
              <svg className="w-6 h-6 text-primary mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <p className="font-medium">Add Movie</p>
              <p className="text-xs text-muted">Add new movie listing</p>
            </button>
            <button className="p-4 bg-secondary rounded-lg hover:bg-card-hover transition-colors text-left">
              <svg className="w-6 h-6 text-accent mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-medium">Schedule Show</p>
              <p className="text-xs text-muted">Add new showtime</p>
            </button>
            <button className="p-4 bg-secondary rounded-lg hover:bg-card-hover transition-colors text-left">
              <svg className="w-6 h-6 text-success mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
              </svg>
              <p className="font-medium">Create Offer</p>
              <p className="text-xs text-muted">New promo code</p>
            </button>
            <button className="p-4 bg-secondary rounded-lg hover:bg-card-hover transition-colors text-left">
              <svg className="w-6 h-6 text-error mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="font-medium">View Reports</p>
              <p className="text-xs text-muted">Analytics & reports</p>
            </button>
          </div>
        </div>
      </div>

      {/* Seat Occupancy Chart Placeholder */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold mb-4">Real-time Seat Occupancy</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {theaters.map((theater) => (
            <div key={theater.id} className="p-4 bg-secondary rounded-lg">
              <p className="font-medium text-sm truncate">{theater.name.split(' - ')[0]}</p>
              <p className="text-xs text-muted mb-2">{theater.location}</p>
              <div className="flex items-end gap-1">
                <span className="text-2xl font-bold">{Math.floor(Math.random() * 40) + 50}%</span>
                <span className="text-xs text-muted mb-1">filled</span>
              </div>
              <div className="w-full bg-border rounded-full h-2 mt-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${Math.floor(Math.random() * 40) + 50}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMovies = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Movies</h2>
        <button className="btn-primary flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Movie
        </button>
      </div>
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary">
            <tr>
              <th className="text-left p-4 font-medium">Movie</th>
              <th className="text-left p-4 font-medium">Language</th>
              <th className="text-left p-4 font-medium">Format</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-left p-4 font-medium">Rating</th>
              <th className="text-left p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((movie) => (
              <tr key={movie.id} className="border-t border-border hover:bg-secondary/50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={movie.poster} alt={movie.title} className="w-12 h-16 object-cover rounded" />
                    <div>
                      <p className="font-medium">{movie.title}</p>
                      <p className="text-xs text-muted">{movie.genres.join(', ')}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">{movie.language}</td>
                <td className="p-4">{movie.format.join(', ')}</td>
                <td className="p-4">
                  <span className={`badge ${movie.status === 'now_showing' ? 'badge-success' : 'badge-warning'}`}>
                    {movie.status === 'now_showing' ? 'Now Showing' : 'Coming Soon'}
                  </span>
                </td>
                <td className="p-4">{movie.rating > 0 ? movie.rating.toFixed(1) : '-'}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-secondary rounded">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button className="p-2 hover:bg-error/20 rounded text-error">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSnacks = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Snacks & Beverages</h2>
        <button className="btn-primary flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Item
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {snacks.map((snack) => (
          <div key={snack.id} className="card p-4">
            <div className="flex gap-4">
              <img src={snack.image} alt={snack.name} className="w-20 h-20 object-cover rounded-lg" />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium">{snack.name}</h3>
                  <div className={`w-4 h-4 border rounded-sm flex items-center justify-center ${
                    snack.isVeg ? 'border-success' : 'border-error'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      snack.isVeg ? 'bg-success' : 'bg-error'
                    }`}></div>
                  </div>
                </div>
                <p className="text-sm text-muted capitalize">{snack.category.replace('_', ' ')}</p>
                <p className="font-semibold mt-1">₹{snack.variants[0].price}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 btn-secondary text-sm py-2">Edit</button>
              <button className="flex-1 btn-secondary text-sm py-2 text-error">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return renderDashboard();
      case 'Movies':
        return renderMovies();
      case 'Snacks':
        return renderSnacks();
      default:
        return (
          <div className="card p-8 text-center">
            <p className="text-muted">Coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <button className="btn-secondary text-sm">
            Export Report
          </button>
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
            A
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab
                ? 'bg-primary text-white'
                : 'bg-secondary hover:bg-card-hover'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
}
