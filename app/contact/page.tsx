export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-foreground mb-6">Contact Us</h1>
        <p className="text-muted text-lg mb-8">
          We&apos;d love to hear from you. Get in touch with us!
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card rounded-lg p-6 border border-border">
            <h2 className="text-xl font-semibold mb-4">Address</h2>
            <p className="text-muted">
              Shindhu Cinemas<br />
              123 Cinema Street<br />
              Movie City, MC 12345
            </p>
          </div>
          <div className="bg-card rounded-lg p-6 border border-border">
            <h2 className="text-xl font-semibold mb-4">Contact Info</h2>
            <p className="text-muted">
              Email: support@shindhucinemas.com<br />
              Phone: +91 98765 43210
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
