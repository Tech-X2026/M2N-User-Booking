import { useEffect, useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import api from '../lib/api';
import PageTransition from '../components/PageTransition';
import { Link, useNavigate } from 'react-router-dom';

export default function MyBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/my-bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Failed to fetch bookings', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [user, navigate]);

  const handleCancelRequest = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to request a cancellation for this booking?')) {
      return;
    }
    
    setCancellingId(bookingId);
    try {
      await api.post(`/bookings/${bookingId}/request-cancel`);
      await fetchBookings();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to request cancellation');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <p className="text-[11px] font-bold text-m2n-saffron uppercase tracking-widest animate-pulse">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="pb-32 pt-32 px-6 max-w-[1080px] mx-auto min-h-screen">
        <div className="mb-16 border-b border-border pb-8">
          <p className="text-m2n-saffron font-bold tracking-[2px] text-[11px] mb-3 uppercase">Your Reservations</p>
          <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] text-m2n-ink font-bold leading-tight">
            My Bookings
          </h1>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white border border-border rounded-xl p-12 text-center shadow-sm">
            <p className="font-display text-2xl text-m2n-ink font-bold mb-6">You have no upcoming stays with us.</p>
            <Link to="/hotels" className="btn btn-primary px-6 py-2.5 text-sm">Explore Our Properties</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white border border-border rounded-xl flex flex-col md:flex-row overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {booking.hotelId?.images?.[0] && (
                  <div className="md:w-[320px] h-[240px] md:h-auto shrink-0 relative">
                    <img 
                      src={booking.hotelId.images[0]} 
                      alt={booking.hotelId.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-display text-2xl text-m2n-ink font-bold">{booking.hotelId?.name}</h3>
                      <p className="text-xs text-text-3 font-medium mt-1 uppercase tracking-wider">{booking.hotelId?.city}, {booking.hotelId?.state}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded ${
                        booking.status === 'confirmed' ? 'bg-m2n-emerald/10 text-m2n-emerald' : 
                        booking.status === 'pending' ? 'bg-m2n-saffron/10 text-m2n-saffron' : 
                        'bg-m2n-rose/10 text-m2n-rose'
                      }`}>
                        {booking.status}
                      </span>
                      {booking.cancellationRequested && booking.status === 'confirmed' && (
                        <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-m2n-saffron/10 text-m2n-saffron rounded">
                          Cancellation Requested
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 flex-1">
                    <div>
                      <p className="text-[10px] font-bold text-text-3 uppercase tracking-wider mb-1">Check-in</p>
                      <p className="text-sm text-m2n-ink font-medium">{new Date(booking.checkIn).toLocaleDateString()}</p>
                      <p className="text-xs text-text-2 mt-0.5">{booking.checkInTime || '14:00'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-text-3 uppercase tracking-wider mb-1">Check-out</p>
                      <p className="text-sm text-m2n-ink font-medium">{new Date(booking.checkOut).toLocaleDateString()}</p>
                      <p className="text-xs text-text-2 mt-0.5">{booking.checkOutTime || '11:00'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[10px] font-bold text-text-3 uppercase tracking-wider mb-1">Details</p>
                      <p className="text-sm text-m2n-ink font-medium">{booking.quantity}x {booking.roomCategoryId?.name}</p>
                      <p className="text-xs text-text-2 mt-0.5">{booking.adults || 1} Adults, {booking.children || 0} Children</p>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-border flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mt-auto">
                    <div>
                      <p className="text-[10px] font-bold text-text-3 uppercase tracking-wider mb-1">Total Amount</p>
                      <p className="font-display text-xl text-m2n-ink font-bold mt-1">₹{booking.totalAmount?.toLocaleString()}</p>
                      <p className="text-[10px] text-text-3 font-mono mt-1 uppercase">ID: {booking.bookingId || booking._id}</p>
                    </div>
                    
                    {booking.status === 'confirmed' && !booking.cancellationRequested && (
                      <button 
                        onClick={() => handleCancelRequest(booking._id)}
                        disabled={cancellingId === booking._id}
                        className="btn btn-ghost border-m2n-rose text-m2n-rose hover:bg-m2n-rose hover:text-white px-5 py-2 text-xs"
                      >
                        {cancellingId === booking._id ? 'Requesting...' : 'Request Cancellation'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
