import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../lib/api';
import { inr } from '../lib/lib';
import OccupancySelector from './OccupancySelector';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function HeroBookingCard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const todayDate = new Date().toISOString().split('T')[0];

  const [hotels, setHotels] = useState<any[]>([]);
  const [selectedHotel, setSelectedHotel] = useState('');
  
  const [rooms, setRooms] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState('');

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  
  // Default times for booking
  const [checkInTime, setCheckInTime] = useState('14:00');
  const [checkOutTime, setCheckOutTime] = useState('11:00');

  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [quantity, setQuantity] = useState(1); // quantity is rooms
  const [isOccupancyOpen, setIsOccupancyOpen] = useState(false);

  const [availability, setAvailability] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch hotels on mount
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:5000/api'}/public/hotels`)
      .then(res => setHotels(res.data))
      .catch(err => console.error('Failed to fetch hotels', err));
  }, []);

  // Fetch rooms when hotel changes
  useEffect(() => {
    if (!selectedHotel) {
      setRooms([]);
      setSelectedRoom('');
      setAvailability(null);
      return;
    }

    axios.get(`${import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:5000/api'}/public/hotels/${selectedHotel}/categories`)
      .then(res => {
        setRooms(res.data || []);
        setSelectedRoom('');
        setAvailability(null);
      })
      .catch(err => console.error('Failed to fetch hotel categories', err));
  }, [selectedHotel]);

  const handleCheckAvailability = async () => {
    if (!selectedHotel || !selectedRoom || !checkIn || !checkOut) {
      setError('Please fill all fields to check availability.');
      return;
    }

    setLoading(true);
    setError('');
    setAvailability(null);

    try {
      const res = await api.post('/bookings/check-availability', {
        roomCategoryId: selectedRoom,
        checkIn,
        checkInTime,
        checkOut,
        checkOutTime,
      });
      setAvailability(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error checking availability');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/bookings/create', {
        hotelId: selectedHotel,
        roomCategoryId: selectedRoom,
        checkIn,
        checkInTime,
        checkOut,
        checkOutTime,
        quantity,
        adults,
        children: childrenCount
      });

      const { orderId, amount, currency, bookingId, keyId } = res.data;

      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: 'M2N Group Of Hotels',
        description: 'Room Booking',
        order_id: orderId,
        handler: async function (response: any) {
          try {
            await api.post('/bookings/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId
            });
            navigate('/my-bookings');
          } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Payment verification failed';
            setError(`Error: ${errorMessage}`);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || ''
        },
        theme: {
          color: '#B65C43'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setError('Payment failed: ' + response.error.description);
      });
      rzp.open();

    } catch (err: any) {
      setError(err.response?.data?.message || 'Error creating booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-white shadow-2xl p-4 border-t-4 border-terracotta relative z-50 rounded-sm">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
        {/* Destination */}
        <div className="md:col-span-1">
          <label className="u-label-sm text-muted block mb-1">Destination</label>
          <select 
            className="field w-full h-12 bg-cream/30" 
            value={selectedHotel}
            onChange={(e) => setSelectedHotel(e.target.value)}
          >
            <option value="">Select Hotel</option>
            {hotels.map(h => (
              <option key={h._id} value={h._id}>{h.name}</option>
            ))}
          </select>
        </div>

        {/* Room Type */}
        <div className="md:col-span-1">
          <label className="u-label-sm text-muted block mb-1">Room Type</label>
          <select 
            className="field w-full h-12 bg-cream/30" 
            value={selectedRoom}
            onChange={(e) => { setSelectedRoom(e.target.value); setAvailability(null); }}
            disabled={!selectedHotel || rooms.length === 0}
          >
            <option value="">{selectedHotel ? (rooms.length > 0 ? "Select Room" : "Loading...") : "Select Hotel First"}</option>
            {rooms.map(r => (
              <option key={r._id} value={r._id}>{r.name}</option>
            ))}
          </select>
        </div>

        {/* Check In */}
        <div className="md:col-span-1">
          <label className="u-label-sm text-muted block mb-1">Check-in</label>
          <div className="flex gap-1">
            <input 
              type="date" 
              className="field w-2/3 h-12 bg-cream/30 px-2" 
              value={checkIn} 
              min={todayDate} 
              onChange={e => { setCheckIn(e.target.value); setAvailability(null); }} 
            />
            <input 
              type="time" 
              className="field w-1/3 h-12 bg-cream/30 px-1 text-center text-sm" 
              value={checkInTime} 
              onChange={e => { setCheckInTime(e.target.value); setAvailability(null); }} 
            />
          </div>
        </div>

        {/* Check Out */}
        <div className="md:col-span-1">
          <label className="u-label-sm text-muted block mb-1">Check-out</label>
          <div className="flex gap-1">
            <input 
              type="date" 
              className="field w-2/3 h-12 bg-cream/30 px-2" 
              value={checkOut} 
              min={checkIn || todayDate} 
              onChange={e => { setCheckOut(e.target.value); setAvailability(null); }} 
            />
            <input 
              type="time" 
              className="field w-1/3 h-12 bg-cream/30 px-1 text-center text-sm" 
              value={checkOutTime} 
              onChange={e => { setCheckOutTime(e.target.value); setAvailability(null); }} 
            />
          </div>
        </div>

        {/* Occupancy */}
        <div className="md:col-span-1">
          <OccupancySelector 
            adults={adults}
            setAdults={(val) => { setAdults(val); setAvailability(null); }}
            childrenCount={childrenCount}
            setChildrenCount={(val) => { setChildrenCount(val); setAvailability(null); }}
            rooms={quantity}
            setRooms={(val) => { setQuantity(val); setAvailability(null); }}
            isOpen={isOccupancyOpen}
            setIsOpen={setIsOccupancyOpen}
          />
        </div>

        {/* Search Button */}
        <div className="md:col-span-1">
          <button 
            onClick={handleCheckAvailability}
            disabled={loading || !selectedHotel || !selectedRoom || !checkIn || !checkOut}
            className="h-12 w-full bg-ink text-porcelain transition-colors hover:bg-terracotta disabled:opacity-50 disabled:cursor-not-allowed u-label"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {error && <div className="mt-4 p-3 bg-terracotta/10 text-terracotta text-sm">{error}</div>}

      {/* Expanded Results Section */}
      {availability && (
        <div className="mt-6 border-t border-line pt-6">
          {availability.availableRooms > 0 ? (
            <div className="flex flex-col md:flex-row items-center justify-between bg-cream/30 p-6 rounded-sm">
              <div>
                <p className="text-sage text-sm font-medium mb-1">✓ {availability.availableRooms} rooms available</p>
                <p className="text-2xl t-section">{inr(availability.pricePerNight)} <span className="text-sm text-muted font-sans font-light tracking-normal">/ night</span></p>
              </div>
              
              <div className="flex items-center gap-6 mt-4 md:mt-0">
                <div>
                  <p className="u-label-sm text-muted mb-1">Total</p>
                  <p className="u-label text-ink h-12 flex items-center">
                    {inr(availability.pricePerNight * quantity * Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 3600 * 24)))}
                  </p>
                </div>

                <button 
                  onClick={handleBooking} 
                  disabled={loading}
                  className="h-12 px-8 bg-terracotta text-white transition-colors hover:bg-ink u-label whitespace-nowrap mt-5 md:mt-0"
                >
                  {loading ? 'Processing...' : (user ? 'Book Now' : 'Login to Book')}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-terracotta/5 text-center">
              <p className="text-terracotta font-medium">Sorry, no rooms are available for these dates.</p>
              <p className="text-sm text-muted mt-2">Try selecting different dates or a different room type.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
