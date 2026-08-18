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
  const [checkInTime] = useState('14:00');
  const [checkOutTime] = useState('11:00');

  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [quantity, setQuantity] = useState(1);
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
          color: '#d97316' // m2n-saffron
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
    <div className="search-card z-50 w-full max-w-[1280px] mx-auto">
      <div className="search-tabs">
        <button className="stab active">Hotels</button>
        <button className="stab" onClick={() => navigate('/dining')}>Dining</button>
        <button className="stab" onClick={() => navigate('/experiences')}>Experiences</button>
      </div>

      <div className="search-grid mt-4">
        {/* Destination */}
        <div className="sfield focus-within:border-m2n-saffron focus-within:ring-2 focus-within:ring-m2n-saffron/10">
          <label>DESTINATION</label>
          <select 
            className="w-full bg-transparent outline-none text-[13px] font-semibold text-text-1 appearance-none cursor-pointer mt-1"
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
        <div className="sfield focus-within:border-m2n-saffron focus-within:ring-2 focus-within:ring-m2n-saffron/10">
          <label>ROOM TYPE</label>
          <select 
            className="w-full bg-transparent outline-none text-[13px] font-semibold text-text-1 appearance-none cursor-pointer mt-1"
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

        {/* Check In/Out */}
        <div className="sfield focus-within:border-m2n-saffron focus-within:ring-2 focus-within:ring-m2n-saffron/10 flex flex-col justify-center">
          <label>DATES</label>
          <div className="flex gap-2 items-center mt-1">
            <input 
              type="date" 
              className="w-1/2 bg-transparent outline-none text-[12px] font-semibold text-text-1" 
              value={checkIn} 
              min={todayDate} 
              onChange={e => { setCheckIn(e.target.value); setAvailability(null); }} 
            />
            <span className="text-text-3 text-xs">-</span>
            <input 
              type="date" 
              className="w-1/2 bg-transparent outline-none text-[12px] font-semibold text-text-1" 
              value={checkOut} 
              min={checkIn || todayDate} 
              onChange={e => { setCheckOut(e.target.value); setAvailability(null); }} 
            />
          </div>
        </div>

        {/* Occupancy */}
        <div className="sfield flex-col justify-center" style={{ position: 'relative' }}>
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
        <button 
          onClick={handleCheckAvailability}
          disabled={loading || !selectedHotel || !selectedRoom || !checkIn || !checkOut}
          className="sbtn h-full py-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Searching...' : 'Check Availability'}
        </button>
      </div>

      <div className="search-extras">
        <label><input type="checkbox" /> My Dates are Flexible</label>
        <label><input type="checkbox" /> Add Airport Transfer</label>
      </div>

      {error && <div className="mt-4 p-3 bg-m2n-rose/10 text-m2n-rose text-sm rounded-md font-medium">{error}</div>}

      {/* Expanded Results Section */}
      {availability && (
        <div className="mt-6 border-t border-border pt-6 animate-in slide-in-from-top-2 duration-300">
          {availability.availableRooms > 0 ? (
            <div className="flex flex-col md:flex-row items-center justify-between bg-bg-soft border border-border p-5 rounded-xl">
              <div>
                <p className="text-m2n-emerald text-[13px] font-bold mb-1 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-m2n-emerald inline-block"></span> 
                  {availability.availableRooms} rooms available
                </p>
                <p className="text-2xl font-bold text-m2n-ink">
                  {inr(availability.pricePerNight)} <span className="text-[11px] text-text-3 font-normal tracking-normal uppercase">/ night</span>
                </p>
              </div>
              
              <div className="flex items-center gap-6 mt-4 md:mt-0">
                <div className="text-right">
                  <p className="text-[10px] font-bold text-text-3 uppercase mb-0.5">Total</p>
                  <p className="text-[18px] font-bold text-m2n-ink">
                    {inr(availability.pricePerNight * quantity * Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 3600 * 24)))}
                  </p>
                </div>

                <button 
                  onClick={handleBooking} 
                  disabled={loading}
                  className="btn btn-primary px-8 h-11 text-sm whitespace-nowrap shadow-md hover:shadow-lg"
                >
                  {loading ? 'Processing...' : (user ? 'Book Now' : 'Login to Book')}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-m2n-rose/5 border border-m2n-rose/20 rounded-xl text-center">
              <p className="text-m2n-rose font-bold text-sm">Sorry, no rooms are available for these dates.</p>
              <p className="text-[12px] text-text-2 mt-1 font-medium">Try selecting different dates or a different room type.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
