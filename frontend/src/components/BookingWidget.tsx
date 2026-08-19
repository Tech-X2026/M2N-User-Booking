import React, { useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { inr } from '../lib/lib';
import OccupancySelector from './OccupancySelector';
import CustomSelect from './CustomSelect';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function BookingWidget({ hotelId, hotelRooms, preSelectedRoomId, onClose }: { hotelId: string; hotelRooms: any[]; preSelectedRoomId?: string; onClose?: () => void }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const todayDate = new Date().toISOString().split('T')[0];
  
  const [checkIn, setCheckIn] = useState('');
  const [checkInTime, setCheckInTime] = useState('14:00');
  const [checkOut, setCheckOut] = useState('');
  const [checkOutTime, setCheckOutTime] = useState('11:00');
  const [selectedRoom, setSelectedRoom] = useState(preSelectedRoomId || '');
  
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isOccupancyOpen, setIsOccupancyOpen] = useState(false);
  
  const [availability, setAvailability] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckAvailability = async () => {
    if (!checkIn || !checkOut || !selectedRoom) {
      setError('Please fill all fields');
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
        hotelId,
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
      rzp.on('payment.failed', function (response: any){
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
    <div className="bg-white p-8 border border-line relative">
      {onClose && (
        <button onClick={onClose} className="absolute top-4 right-4 text-muted hover:text-terracotta">
          ✕
        </button>
      )}
      <h3 className="t-section text-3xl mb-6">Book Your Stay</h3>
      
      {error && <div className="mb-4 p-3 bg-terracotta/10 text-terracotta text-sm">{error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="u-label-sm text-muted">Check-in Date & Time</label>
          <div className="flex gap-2 mt-1">
            <input type="date" className="field w-2/3" value={checkIn} min={todayDate} onChange={e => setCheckIn(e.target.value)} />
            <input type="time" className="field w-1/3 px-2" value={checkInTime} onChange={e => setCheckInTime(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="u-label-sm text-muted">Check-out Date & Time</label>
          <div className="flex gap-2 mt-1">
            <input type="date" className="field w-2/3" value={checkOut} min={checkIn || todayDate} onChange={e => setCheckOut(e.target.value)} />
            <input type="time" className="field w-1/3 px-2" value={checkOutTime} onChange={e => setCheckOutTime(e.target.value)} />
          </div>
        </div>
      </div>
      
      <div className="mb-6">
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
      
      {!preSelectedRoomId && (
        <div className="mb-6 relative">
          <label className="u-label-sm text-muted">Room Category</label>
          <div className="field mt-1 w-full bg-cream/30 px-3">
            <CustomSelect
              value={selectedRoom}
              onChange={(val) => { setSelectedRoom(val); setAvailability(null); }}
              options={hotelRooms.map(r => ({ value: r._id, label: `${r.name} - ${inr(r.price)}/night` }))}
              placeholder="Select a room..."
            />
          </div>
        </div>
      )}
      
      {!availability ? (
        <button 
          onClick={handleCheckAvailability} 
          disabled={loading || !checkIn || !checkOut || !selectedRoom}
          className="btn-outline w-full justify-center"
        >
          {loading ? 'Checking...' : 'Check Availability'}
        </button>
      ) : (
        <div className="border-t border-line pt-6 mt-2">
          {availability.availableRooms > 0 ? (
            <>
              <p className="text-sage text-sm mb-4">{availability.availableRooms} rooms available for these dates!</p>
              <p className="u-label text-ink mb-6">Total Estimate: {inr(availability.pricePerNight * quantity * Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 3600 * 24)))}</p>
              
              <button 
                onClick={handleBooking} 
                disabled={loading}
                className="btn-outline w-full justify-center bg-ink text-porcelain hover:bg-ink/90"
              >
                {loading ? 'Processing...' : (user ? 'Proceed to Payment' : 'Login to Book')}
              </button>
            </>
          ) : (
            <p className="text-terracotta text-sm">Sorry, no rooms available for these dates.</p>
          )}
        </div>
      )}
    </div>
  );
}
