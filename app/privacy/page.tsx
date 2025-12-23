export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-foreground mb-6">Privacy Policy</h1>
        <p className="text-muted text-lg mb-8">
          Your privacy is important to us. This policy explains how we handle your data.
        </p>
        <div className="bg-card rounded-lg p-8 border border-border space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">Information We Collect</h2>
            <p className="text-muted">
              We collect information you provide directly, such as name, email, phone number, and payment details when you create an account or make a purchase.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">How We Use Your Information</h2>
            <p className="text-muted">
              We use your information to process bookings, send confirmations, provide customer support, and improve our services.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">Data Security</h2>
            <p className="text-muted">
              We implement industry-standard security measures to protect your personal information from unauthorized access.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">Cookies</h2>
            <p className="text-muted">
              We use cookies to enhance your browsing experience and analyze site traffic. You can manage cookie preferences in your browser settings.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
            <p className="text-muted">
              For privacy-related inquiries, contact us at privacy@shindhucinemas.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
