import React, { useState, useEffect } from 'react';
import CustomSelect from './CustomSelect';
import LocationSelectionModal from './LocationModal/LocationSelectionModal';
import { useAuth } from '../lib/AuthContext';
import { useLocationContext } from '../lib/LocationContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../lib/api';
import { inr } from '../lib/lib';
import OccupancySelector from './OccupancySelector';
import { useHotelSearchPersistence } from '../hooks/useHotelSearchPersistence';
import { RiHome4Line, RiBuilding4Line, RiRestaurantLine, RiCompass3Line, RiHeartLine } from 'react-icons/ri';

const NAV = [
  { label: 'Home', to: '/', icon: RiHome4Line },
  { label: 'Stays', to: '/', icon: RiBuilding4Line }, // Stays is the current active search card
  { label: 'Restaurant & Dine-In', to: '/dining', icon: RiRestaurantLine },
  { label: 'Experiences', to: '/experiences', icon: RiCompass3Line },
  { label: 'Weddings', to: '/events', icon: RiHeartLine },
];

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function HeroBookingCard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { selectedCity, setSelectedCity } = useLocationContext();
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
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  const { initialSearchState, saveSearchState } = useHotelSearchPersistence();

  // Hydrate form from saved search state on mount
  useEffect(() => {
    if (initialSearchState) {
      if (!selectedCity && initialSearchState.destination) {
        setSelectedCity({ id: initialSearchState.destinationId as string, name: initialSearchState.destination, state: '' });
      }
      if (initialSearchState.checkIn) setCheckIn(initialSearchState.checkIn);
      if (initialSearchState.checkOut) setCheckOut(initialSearchState.checkOut);
      if (initialSearchState.rooms) setQuantity(initialSearchState.rooms);
      if (initialSearchState.guests?.adults) setAdults(initialSearchState.guests.adults);
      if (initialSearchState.guests?.children !== undefined) setChildrenCount(initialSearchState.guests.children);
    }
  }, [initialSearchState, setSelectedCity]); // Run only when initialSearchState loads

  const checkInRef = React.useRef<HTMLInputElement>(null);
  const checkOutRef = React.useRef<HTMLInputElement>(null);

  const handleCheckInClick = () => {
    try {
      checkInRef.current?.showPicker();
    } catch (e) {
      checkInRef.current?.focus();
    }
  };

  const handleCheckOutClick = () => {
    try {
      checkOutRef.current?.showPicker();
    } catch (e) {
      checkOutRef.current?.focus();
    }
  };

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
    // Save search state
    saveSearchState({
      destination: selectedCity?.name || '',
      destinationId: selectedCity?.id || '',
      checkIn,
      checkOut,
      rooms: quantity,
      guests: { adults, children: childrenCount }
    });

    // Navigate to hotels page with location set in context
    navigate('/hotels');
  };

  const filteredHotels = selectedCity
    ? hotels.filter(h => 
        h.city?.toLowerCase() === selectedCity.name.toLowerCase() || 
        h.state?.toLowerCase() === selectedCity.name.toLowerCase()
      )
    : hotels;

  return (
    <div className="search-card z-50 w-full max-w-[1280px] mx-auto">
      <div className="search-tabs flex w-full mb-4 border-b border-border/50 justify-between md:justify-center gap-1 md:gap-6 px-1 md:px-4 pt-2">
        {NAV.filter(n => n.label !== 'Home').map((n) => {
          const isActive = n.label === 'Stays';
          return (
            <button 
              key={n.label} 
              className={`stab flex-1 min-w-0 ${isActive ? 'active' : ''}`}
              style={{ padding: '8px 2px', whiteSpace: 'normal' }}
              onClick={() => { if (!isActive) navigate(n.to) }}
            >
              <n.icon size={20} className={`md:w-[24px] md:h-[24px] shrink-0 ${isActive ? 'text-m2n-saffron' : 'opacity-70'}`} />
              <span className="text-[9px] md:text-[12px] leading-tight text-center break-words">{n.label}</span>
            </button>
          )
        })}
      </div>

      <div className="search-grid mt-4 relative">
        {/* Destination / Location Selector */}
        <div 
          className="sfield focus-within:border-m2n-saffron focus-within:ring-2 focus-within:ring-m2n-saffron/10 relative cursor-pointer flex flex-col justify-center"
          onClick={() => setLocationModalOpen(true)}
        >
          <label>City, Property Name Or Location</label>
          <div className="text-[22px] font-display font-bold text-m2n-ink leading-none mt-1">
            {selectedCity ? selectedCity.name : 'Select Location'}
          </div>
          <div className="text-[13px] text-text-3 mt-1">
            {selectedCity ? 'India' : 'Anywhere'}
          </div>
        </div>

        {/* Check In */}
        <div 
          className="sfield focus-within:border-m2n-saffron focus-within:ring-2 focus-within:ring-m2n-saffron/10 relative flex flex-col justify-center cursor-pointer"
          onClick={handleCheckInClick}
        >
          <label className="flex items-center gap-1">Check-In <span className="text-m2n-saffron">⌄</span></label>
          <input 
            ref={checkInRef}
            type="date" 
            className="absolute inset-0 opacity-0 pointer-events-none w-full h-full" 
            value={checkIn} 
            min={todayDate} 
            onChange={e => { setCheckIn(e.target.value); }} 
          />
          <div className="text-[22px] font-display font-bold text-m2n-ink leading-none mt-1">
            {checkIn ? (
              <>
                {new Date(checkIn).getDate()} <span className="text-[16px]">{new Date(checkIn).toLocaleString('default', { month: 'short' })}'{new Date(checkIn).getFullYear().toString().slice(-2)}</span>
              </>
            ) : 'Select Date'}
          </div>
          <div className="text-[13px] text-text-3 mt-1">
            {checkIn ? new Date(checkIn).toLocaleDateString('en-US', { weekday: 'long' }) : '---'}
          </div>
        </div>

        {/* Check Out */}
        <div 
          className="sfield focus-within:border-m2n-saffron focus-within:ring-2 focus-within:ring-m2n-saffron/10 relative flex flex-col justify-center cursor-pointer"
          onClick={handleCheckOutClick}
        >
          <label className="flex items-center gap-1">Check-Out <span className="text-m2n-saffron">⌄</span></label>
          <input 
            ref={checkOutRef}
            type="date" 
            className="absolute inset-0 opacity-0 pointer-events-none w-full h-full" 
            value={checkOut} 
            min={checkIn || todayDate} 
            onChange={e => { setCheckOut(e.target.value); }} 
          />
          <div className="text-[22px] font-display font-bold text-m2n-ink leading-none mt-1">
            {checkOut ? (
              <>
                {new Date(checkOut).getDate()} <span className="text-[16px]">{new Date(checkOut).toLocaleString('default', { month: 'short' })}'{new Date(checkOut).getFullYear().toString().slice(-2)}</span>
              </>
            ) : 'Select Date'}
          </div>
          <div className="text-[13px] text-text-3 mt-1">
            {checkOut ? new Date(checkOut).toLocaleDateString('en-US', { weekday: 'long' }) : '---'}
          </div>
        </div>

        {/* Occupancy */}
        <div className="sfield flex-col justify-center relative cursor-pointer" onClick={() => setIsOccupancyOpen(!isOccupancyOpen)}>
          <label className="flex items-center gap-1">Rooms & Guests <span className="text-m2n-saffron">⌄</span></label>
          <div className="text-[22px] font-display font-bold text-m2n-ink leading-none mt-1">
            {quantity} <span className="text-[16px] font-normal">Rooms</span> {adults} <span className="text-[16px] font-normal">Adults</span>
          </div>
          <div className="text-[13px] text-text-3 mt-1 opacity-0">.</div>
          <OccupancySelector 
            adults={adults}
            setAdults={setAdults}
            childrenCount={childrenCount}
            setChildrenCount={setChildrenCount}
            rooms={quantity}
            setRooms={setQuantity}
            isOpen={isOccupancyOpen}
            setIsOpen={setIsOccupancyOpen}
          />
        </div>

      </div>

      {/* Search Button Overlapping */}
      <div className="absolute left-1/2 -translate-x-1/2 z-10" style={{ bottom: '-29px' }}>
        <button 
          onClick={handleCheckAvailability}
          className="bg-m2n-saffron text-white px-12 py-3.5 rounded-full font-bold text-[15px] shadow-[0_8px_20px_rgba(217,115,22,0.3)] hover:bg-[#b85d0c] transition-all hover:scale-105 uppercase tracking-wider whitespace-nowrap"
        >
          Search
        </button>
      </div>

      <LocationSelectionModal
        isOpen={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        onSelectLocation={(city) => setSelectedCity(city)}
      />
    </div>
  );
}
