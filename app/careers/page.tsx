export default function CareersPage() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-foreground mb-6">Careers</h1>
        <p className="text-muted text-lg mb-8">
          Join our team at Shindhu Cinemas and be part of the movie magic!
        </p>
        <div className="bg-card rounded-lg p-8 border border-border">
          <h2 className="text-2xl font-semibold mb-4">No Open Positions</h2>
          <p className="text-muted">
            We don&apos;t have any open positions at the moment. Please check back later or follow us on social media for updates.
          </p>
        </div>
      </div>
    </div>
  );
}
