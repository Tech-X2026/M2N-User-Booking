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
        <p className="u-label">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="editorial-grid min-h-[80vh] pt-40 pb-32">
        <div className="col-span-12 md:col-span-10 md:col-start-2">
          <p className="u-label text-terracotta">Your Reservations</p>
          <h1 className="t-hero mt-6 mb-16 text-5xl">My Bookings</h1>

          {bookings.length === 0 ? (
            <div className="text-center py-20 border border-line">
              <p className="t-section text-2xl text-muted mb-6">You have no upcoming stays with us.</p>
              <Link to="/hotels" className="btn-outline">Explore Our Properties</Link>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {bookings.map((booking) => (
                <div key={booking._id} className="border border-line flex flex-col md:flex-row relative">
                  {booking.hotelId?.images?.[0] && (
                    <div className="md:w-1/3 aspect-[4/3] md:aspect-auto">
                      <img 
                        src={booking.hotelId.images[0]} 
                        alt={booking.hotelId.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-8 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="t-section text-2xl">{booking.hotelId?.name}</h3>
                          <p className="u-label-sm text-muted mt-1">{booking.hotelId?.city}, {booking.hotelId?.state}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-3 py-1 text-xs uppercase tracking-wider ${
                            booking.status === 'confirmed' ? 'bg-sage/10 text-sage' : 
                            booking.status === 'pending' ? 'bg-warm/10 text-warm' : 
                            'bg-terracotta/10 text-terracotta'
                          }`}>
                            {booking.status}
                          </span>
                          {booking.cancellationRequested && booking.status === 'confirmed' && (
                            <span className="px-3 py-1 text-xs uppercase tracking-wider bg-warm/20 text-warm">
                              Cancellation Requested
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6 mt-8">
                        <div>
                          <p className="u-label-sm text-muted">Check-in</p>
                          <p className="mt-1">{new Date(booking.checkIn).toLocaleDateString()}</p>
                          <p className="text-xs text-muted mt-0.5">{booking.checkInTime || '14:00'}</p>
                        </div>
                        <div>
                          <p className="u-label-sm text-muted">Check-out</p>
                          <p className="mt-1">{new Date(booking.checkOut).toLocaleDateString()}</p>
                          <p className="text-xs text-muted mt-0.5">{booking.checkOutTime || '11:00'}</p>
                        </div>
                        <div>
                          <p className="u-label-sm text-muted">Room Category</p>
                          <p className="mt-1">{booking.roomCategoryId?.name}</p>
                        </div>
                        <div>
                          <p className="u-label-sm text-muted">Rooms Booked</p>
                          <p className="mt-1">{booking.quantity}</p>
                        </div>
                        <div>
                          <p className="u-label-sm text-muted">Occupancy</p>
                          <p className="mt-1">{booking.adults || 1} Adults, {booking.children || 0} Children</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-line flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                      <div>
                        <p className="u-label-sm text-muted">Total Amount</p>
                        <p className="t-section text-xl mt-1">₹{booking.totalAmount?.toLocaleString()}</p>
                        <p className="text-xs text-muted font-mono mt-1">ID: {booking.bookingId || booking._id}</p>
                      </div>
                      
                      {booking.status === 'confirmed' && !booking.cancellationRequested && (
                        <button 
                          onClick={() => handleCancelRequest(booking._id)}
                          disabled={cancellingId === booking._id}
                          className="btn-outline text-terracotta border-terracotta hover:bg-terracotta hover:text-white"
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
      </div>
    </PageTransition>
  );
}
