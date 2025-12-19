export default function SupportPage() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-foreground mb-6">Support</h1>
        <p className="text-muted text-lg mb-8">
          Need help? We&apos;re here to assist you.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg p-6 border border-border">
            <h2 className="text-xl font-semibold mb-4">Customer Support</h2>
            <p className="text-muted mb-4">
              Our support team is available 24/7 to help you with any issues.
            </p>
            <p className="text-primary">support@shindhucinemas.com</p>
          </div>
          <div className="bg-card rounded-lg p-6 border border-border">
            <h2 className="text-xl font-semibold mb-4">Phone Support</h2>
            <p className="text-muted mb-4">
              Call us for immediate assistance.
            </p>
            <p className="text-primary">+91 98765 43210</p>
          </div>
        </div>
      </div>
    </div>
  );
}
