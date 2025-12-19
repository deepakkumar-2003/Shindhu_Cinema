import Link from 'next/link';

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-foreground mb-6">Help Center</h1>
        <p className="text-muted text-lg mb-8">
          Find the help you need to make the most of Shindhu Cinemas.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/faq" className="bg-card rounded-lg p-6 border border-border hover:border-primary transition-colors">
            <h2 className="text-xl font-semibold mb-2">FAQ</h2>
            <p className="text-muted">Find answers to commonly asked questions.</p>
          </Link>
          <Link href="/support" className="bg-card rounded-lg p-6 border border-border hover:border-primary transition-colors">
            <h2 className="text-xl font-semibold mb-2">Contact Support</h2>
            <p className="text-muted">Get in touch with our support team.</p>
          </Link>
          <Link href="/refund" className="bg-card rounded-lg p-6 border border-border hover:border-primary transition-colors">
            <h2 className="text-xl font-semibold mb-2">Refund Policy</h2>
            <p className="text-muted">Learn about our refund and cancellation policy.</p>
          </Link>
          <Link href="/terms" className="bg-card rounded-lg p-6 border border-border hover:border-primary transition-colors">
            <h2 className="text-xl font-semibold mb-2">Terms of Service</h2>
            <p className="text-muted">Read our terms and conditions.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
