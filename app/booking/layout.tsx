import BookingHeader from '@/components/booking/BookingHeader';

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginTop: 'calc(-4rem - 3rem - 1rem)' }}>
      <BookingHeader />
      <div style={{ paddingTop: '60px' }}>
        {children}
      </div>
    </div>
  );
}
