export default function RefundPage() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-foreground mb-6">Refund Policy</h1>
        <p className="text-muted text-lg mb-8">
          Our refund policy for ticket bookings at Shindhu Cinemas.
        </p>
        <div className="bg-card rounded-lg p-8 border border-border space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">Cancellation Window</h2>
            <p className="text-muted">
              Tickets can be cancelled up to 2 hours before the showtime for a full refund.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">Refund Processing</h2>
            <p className="text-muted">
              Refunds are processed within 5-7 business days to the original payment method.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">Non-Refundable Items</h2>
            <p className="text-muted">
              Convenience fees and food/beverage orders are non-refundable once confirmed.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
            <p className="text-muted">
              For refund-related queries, email us at refunds@shindhucinemas.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
