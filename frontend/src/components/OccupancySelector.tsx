import React, { useRef, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';

interface OccupancySelectorProps {
  adults: number;
  setAdults: (val: number) => void;
  childrenCount: number;
  setChildrenCount: (val: number) => void;
  rooms: number;
  setRooms: (val: number) => void;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

export default function OccupancySelector({ adults, setAdults, childrenCount, setChildrenCount, rooms, setRooms, isOpen, setIsOpen }: OccupancySelectorProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  // Auto-calculate rooms based on adults: Math.ceil(adults / 2)
  useEffect(() => {
    const calculatedRooms = Math.ceil(adults / 2);
    if (calculatedRooms > rooms) {
      setRooms(calculatedRooms);
    } else if (rooms > adults) {
      // Don't allow more rooms than adults
      setRooms(adults);
    }
  }, [adults]); // Only trigger when adults change, allowing user manual overrides of rooms otherwise

  const increment = (setter: any, current: number, max: number) => {
    if (current < max) setter(current + 1);
  };
  
  const decrement = (setter: any, current: number, min: number) => {
    if (current > min) setter(current - 1);
  };

  return (
    <div className="relative w-full" ref={popoverRef}>
      <label className="u-label-sm text-muted block mb-1">Occupancy</label>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="field w-full h-12 bg-cream/30 text-left flex items-center justify-between px-3 text-ink"
      >
        <span className="truncate">{adults} adults · {childrenCount} children · {rooms} room{rooms > 1 ? 's' : ''}</span>
        <FiChevronDown size={18} className="text-muted ml-2 shrink-0" />
      </button>

      {isOpen && (
        <div className="mt-2 w-full bg-white border border-line p-4 sm:p-6 rounded-sm">
          
          {/* Adults */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-ink font-medium">Adults</p>
            </div>
            <div className="flex items-center gap-4 border border-line rounded-sm">
              <button 
                type="button" 
                onClick={() => decrement(setAdults, adults, 1)}
                className="w-10 h-10 flex items-center justify-center text-ink hover:bg-cream/50 transition-colors disabled:opacity-30"
                disabled={adults <= 1}
              >-</button>
              <span className="w-4 text-center">{adults}</span>
              <button 
                type="button" 
                onClick={() => increment(setAdults, adults, 30)}
                className="w-10 h-10 flex items-center justify-center text-ink hover:bg-cream/50 transition-colors"
              >+</button>
            </div>
          </div>

          {/* Children */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-ink font-medium">Children</p>
            </div>
            <div className="flex items-center gap-4 border border-line rounded-sm">
              <button 
                type="button" 
                onClick={() => decrement(setChildrenCount, childrenCount, 0)}
                className="w-10 h-10 flex items-center justify-center text-ink hover:bg-cream/50 transition-colors disabled:opacity-30"
                disabled={childrenCount <= 0}
              >-</button>
              <span className="w-4 text-center">{childrenCount}</span>
              <button 
                type="button" 
                onClick={() => increment(setChildrenCount, childrenCount, 10)}
                className="w-10 h-10 flex items-center justify-center text-ink hover:bg-cream/50 transition-colors"
              >+</button>
            </div>
          </div>

          {/* Rooms */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-ink font-medium">Rooms</p>
            </div>
            <div className="flex items-center gap-4 border border-line rounded-sm">
              <button 
                type="button" 
                onClick={() => decrement(setRooms, rooms, 1)}
                className="w-10 h-10 flex items-center justify-center text-ink hover:bg-cream/50 transition-colors disabled:opacity-30"
                disabled={rooms <= 1 || rooms <= Math.ceil(adults / 2)}
              >-</button>
              <span className="w-4 text-center">{rooms}</span>
              <button 
                type="button" 
                onClick={() => increment(setRooms, rooms, 30)}
                className="w-10 h-10 flex items-center justify-center text-ink hover:bg-cream/50 transition-colors disabled:opacity-30"
                disabled={rooms >= adults}
              >+</button>
            </div>
          </div>

          <button 
            type="button" 
            onClick={() => setIsOpen(false)}
            className="w-full btn-outline justify-center border-terracotta text-terracotta hover:bg-terracotta hover:text-white"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
