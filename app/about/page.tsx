'use client';

import './page.css';

export default function AboutPage() {
  const milestones = [
    { year: '2010', title: 'Founded', description: 'Shindhu Cinemas was established with a vision to revolutionize the movie-going experience.' },
    { year: '2015', title: 'Expansion', description: 'Opened our flagship multiplex with 6 screens and premium seating.' },
    { year: '2018', title: 'Technology Upgrade', description: 'Introduced Dolby Atmos and IMAX screens for immersive viewing.' },
    { year: '2022', title: 'Digital Innovation', description: 'Launched our mobile app and online booking platform.' },
    { year: '2024', title: 'Premium Experience', description: 'Introduced luxury recliners and gourmet food options.' },
  ];

  const values = [
    {
      title: 'Quality Entertainment',
      description: 'We bring you the best movies with state-of-the-art audio-visual technology.',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
      ),
    },
    {
      title: 'Customer First',
      description: 'Your comfort and satisfaction are our top priorities.',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      title: 'Innovation',
      description: 'Constantly evolving to provide cutting-edge cinema experiences.',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      title: 'Community',
      description: 'Building a community of movie lovers and creating shared memories.',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  ];

  const team = [
    { name: 'Rajesh Kumar', role: 'Founder & CEO', image: '/images/team/ceo.jpg' },
    { name: 'Priya Sharma', role: 'Operations Director', image: '/images/team/operations.jpg' },
    { name: 'Amit Patel', role: 'Technical Head', image: '/images/team/tech.jpg' },
    { name: 'Sneha Reddy', role: 'Marketing Manager', image: '/images/team/marketing.jpg' },
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <div className="about-hero">
        <h1 className="about-hero-title">About Shindhu Cinemas</h1>
        <p className="about-hero-subtitle">
          Your premier destination for unforgettable movie experiences since 2010.
          We combine cutting-edge technology with exceptional service to bring
          cinema magic to life.
        </p>
      </div>

      {/* Mission Section */}
      <section className="about-mission-section">
        <div className="about-mission-card">
          <h2 className="about-mission-title">Our Mission</h2>
          <p className="about-mission-text">
            At Shindhu Cinemas, we believe that watching a movie should be more than just
            entertainment—it should be an experience. Our mission is to create moments of
            joy, wonder, and connection through the magic of cinema. We strive to provide
            world-class facilities, exceptional service, and an atmosphere that makes every
            visit memorable.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-values-section">
        <h2 className="about-section-title">Our Values</h2>
        <div className="about-values-grid">
          {values.map((value, index) => (
            <div key={index} className="about-value-card">
              <div className="about-value-icon">{value.icon}</div>
              <h3 className="about-value-title">{value.title}</h3>
              <p className="about-value-description">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="about-timeline-section">
        <h2 className="about-section-title">Our Journey</h2>
        <div className="about-timeline">
          {milestones.map((milestone, index) => (
            <div key={index} className="about-timeline-item">
              <div className="about-timeline-marker">
                <div className="about-timeline-dot"></div>
                {index < milestones.length - 1 && <div className="about-timeline-line"></div>}
              </div>
              <div className="about-timeline-content">
                <div className="about-timeline-year">{milestone.year}</div>
                <h3 className="about-timeline-title">{milestone.title}</h3>
                <p className="about-timeline-description">{milestone.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="about-team-section">
        <h2 className="about-section-title">Leadership Team</h2>
        <p className="about-section-subtitle">
          Meet the passionate individuals driving Shindhu Cinemas forward
        </p>
        <div className="about-team-grid">
          {team.map((member, index) => (
            <div key={index} className="about-team-card">
              <div className="about-team-avatar">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="about-team-name">{member.name}</h3>
              <p className="about-team-role">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="about-contact-section">
        <div className="about-contact-card">
          <h2 className="about-contact-title">Visit Us</h2>
          <div className="about-contact-grid">
            <div className="about-contact-item">
              <svg className="about-contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <h4 className="about-contact-label">Address</h4>
                <p className="about-contact-value">123 Cinema Complex, Main Road<br />City Center, State - 560001</p>
              </div>
            </div>
            <div className="about-contact-item">
              <svg className="about-contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <div>
                <h4 className="about-contact-label">Phone</h4>
                <p className="about-contact-value">+91 98765 43210<br />+91 98765 43211</p>
              </div>
            </div>
            <div className="about-contact-item">
              <svg className="about-contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div>
                <h4 className="about-contact-label">Email</h4>
                <p className="about-contact-value">info@shindhucinemas.com<br />support@shindhucinemas.com</p>
              </div>
            </div>
            <div className="about-contact-item">
              <svg className="about-contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="about-contact-label">Hours</h4>
                <p className="about-contact-value">Open Daily: 9:00 AM - 12:00 AM<br />Box Office: 10:00 AM - 10:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
