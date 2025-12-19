export default function PressPage() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-foreground mb-6">Press</h1>
        <p className="text-muted text-lg mb-8">
          Media inquiries and press releases from Shindhu Cinemas.
        </p>
        <div className="bg-card rounded-lg p-8 border border-border">
          <h2 className="text-2xl font-semibold mb-4">Media Contact</h2>
          <p className="text-muted mb-4">
            For press inquiries, please contact us at:
          </p>
          <p className="text-primary">press@shindhucinemas.com</p>
        </div>
      </div>
    </div>
  );
}
