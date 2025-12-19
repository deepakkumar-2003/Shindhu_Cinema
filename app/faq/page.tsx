export default function FAQPage() {
  const faqs = [
    {
      question: 'How do I book tickets?',
      answer: 'You can book tickets by selecting a movie, choosing your preferred showtime, selecting seats, and completing the payment.'
    },
    {
      question: 'Can I cancel my booking?',
      answer: 'Yes, you can cancel your booking up to 2 hours before the showtime. Please check our refund policy for more details.'
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept all major credit/debit cards, UPI, net banking, and digital wallets.'
    },
    {
      question: 'How do I get my tickets?',
      answer: 'After successful booking, you will receive an e-ticket via email and SMS. You can also view your tickets in your profile.'
    },
    {
      question: 'Is there parking available?',
      answer: 'Yes, we have ample parking space available for all our visitors.'
    }
  ];

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-foreground mb-6">Frequently Asked Questions</h1>
        <p className="text-muted text-lg mb-8">
          Find answers to common questions about Shindhu Cinemas.
        </p>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-card rounded-lg p-6 border border-border">
              <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
              <p className="text-muted">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
