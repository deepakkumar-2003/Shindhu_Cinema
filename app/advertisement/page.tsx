'use client';

import './page.css';

export default function AdvertisementPage() {
  const adPackages = [
    {
      id: 1,
      name: 'Screen Ads',
      description: 'Display your brand on the big screen before movie screenings',
      features: ['30-60 second slots', 'Premium visibility', 'All screens coverage', 'Peak hours availability'],
      price: 'Starting from ₹25,000/week',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
      ),
    },
    {
      id: 2,
      name: 'Lobby Branding',
      description: 'Premium standees, posters, and digital displays in our lobby areas',
      features: ['High footfall areas', 'Digital & print options', 'Custom installations', 'Event partnerships'],
      price: 'Starting from ₹15,000/week',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      id: 3,
      name: 'Digital Marketing',
      description: 'Reach our audience through our website, app, and email campaigns',
      features: ['Website banners', 'App notifications', 'Email newsletters', 'Social media promotion'],
      price: 'Starting from ₹10,000/campaign',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 4,
      name: 'Sampling & Activations',
      description: 'Product sampling and brand activation opportunities at our venues',
      features: ['Product sampling', 'Brand activations', 'Contest & giveaways', 'Experiential marketing'],
      price: 'Custom pricing',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        </svg>
      ),
    },
  ];

  const stats = [
    { value: '50K+', label: 'Daily Footfall' },
    { value: '4+', label: 'Screens' },
    { value: '95%', label: 'Seat Occupancy' },
    { value: '100K+', label: 'Monthly App Users' },
  ];

  return (
    <div className="advertisement-page">
      {/* Hero Section */}
      <div className="ad-hero">
        <h1 className="ad-hero-title">Advertise With Us</h1>
        <p className="ad-hero-subtitle">
          Reach thousands of movie enthusiasts every day. Partner with Shindhu Cinemas
          to showcase your brand to a captive, engaged audience.
        </p>
      </div>

      {/* Stats Section */}
      <div className="ad-stats">
        {stats.map((stat, index) => (
          <div key={index} className="ad-stat-card">
            <div className="ad-stat-value">{stat.value}</div>
            <div className="ad-stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Ad Packages */}
      <section className="ad-packages-section">
        <h2 className="ad-section-title">Advertising Packages</h2>
        <p className="ad-section-subtitle">
          Choose from our range of advertising solutions designed to maximize your brand visibility
        </p>

        <div className="ad-packages-grid">
          {adPackages.map((pkg) => (
            <div key={pkg.id} className="ad-package-card">
              <div className="ad-package-icon">{pkg.icon}</div>
              <h3 className="ad-package-name">{pkg.name}</h3>
              <p className="ad-package-description">{pkg.description}</p>
              <ul className="ad-package-features">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="ad-package-feature">
                    <svg className="ad-feature-check" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="ad-package-price">{pkg.price}</div>
              <button className="ad-package-btn">Get Quote</button>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="ad-contact-section">
        <div className="ad-contact-card">
          <h2 className="ad-contact-title">Ready to Get Started?</h2>
          <p className="ad-contact-description">
            Contact our advertising team to discuss custom packages and partnership opportunities.
          </p>
          <div className="ad-contact-info">
            <div className="ad-contact-item">
              <svg className="ad-contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>advertising@shindhucinemas.com</span>
            </div>
            <div className="ad-contact-item">
              <svg className="ad-contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>+91 98765 43210</span>
            </div>
          </div>
          <button className="ad-contact-btn">Contact Us</button>
        </div>
      </section>
    </div>
  );
}
