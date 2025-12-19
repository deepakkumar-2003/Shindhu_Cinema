export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-foreground mb-6">Terms of Service</h1>
        <p className="text-muted text-lg mb-8">
          Please read these terms carefully before using our services.
        </p>
        <div className="bg-card rounded-lg p-8 border border-border space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p className="text-muted">
              By accessing and using Shindhu Cinemas services, you agree to be bound by these Terms of Service.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">2. Ticket Purchase</h2>
            <p className="text-muted">
              All ticket purchases are subject to availability. Tickets are non-transferable and valid only for the specified showtime.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">3. User Conduct</h2>
            <p className="text-muted">
              Users must maintain appropriate behavior within cinema premises. Recording or photography during screenings is strictly prohibited.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">4. Liability</h2>
            <p className="text-muted">
              Shindhu Cinemas is not liable for any personal belongings lost or damaged on the premises.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">5. Changes to Terms</h2>
            <p className="text-muted">
              We reserve the right to modify these terms at any time. Continued use of our services constitutes acceptance of updated terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
