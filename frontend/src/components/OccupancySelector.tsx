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
      {/* We use a specific label style to match .sfield if not wrapped properly, but it's better to rely on parent. Wait, we can just use the exact same classes as .sfield label. */}
      <label className="block text-[10px] font-bold text-text-3 mb-[2px] tracking-[0.5px] uppercase">OCCUPANCY</label>
      
      <div 
        className="flex items-center justify-between w-full mt-1 bg-transparent text-[13px] font-semibold text-text-1 outline-none cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate pr-2">{adults} adults · {childrenCount} children · {rooms} room{rooms > 1 ? 's' : ''}</span>
        <FiChevronDown size={14} className={`text-text-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-2 w-full min-w-[220px] bg-white border border-border rounded-md shadow-lg p-3">
          
          {/* Adults */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-semibold text-text-1">Adults</span>
            <div className="flex items-center gap-3 border border-border rounded-md px-1 py-0.5">
              <button 
                type="button" 
                onClick={() => decrement(setAdults, adults, 1)}
                className="w-6 h-6 flex items-center justify-center text-text-1 hover:bg-bg-soft rounded transition-colors disabled:opacity-30"
                disabled={adults <= 1}
              >-</button>
              <span className="w-4 text-center text-[13px] font-semibold">{adults}</span>
              <button 
                type="button" 
                onClick={() => increment(setAdults, adults, 30)}
                className="w-6 h-6 flex items-center justify-center text-text-1 hover:bg-bg-soft rounded transition-colors"
              >+</button>
            </div>
          </div>

          {/* Children */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-[13px] font-semibold text-text-1">Children</span>
            <div className="flex items-center gap-3 border border-border rounded-md px-1 py-0.5">
              <button 
                type="button" 
                onClick={() => decrement(setChildrenCount, childrenCount, 0)}
                className="w-6 h-6 flex items-center justify-center text-text-1 hover:bg-bg-soft rounded transition-colors disabled:opacity-30"
                disabled={childrenCount <= 0}
              >-</button>
              <span className="w-4 text-center text-[13px] font-semibold">{childrenCount}</span>
              <button 
                type="button" 
                onClick={() => increment(setChildrenCount, childrenCount, 10)}
                className="w-6 h-6 flex items-center justify-center text-text-1 hover:bg-bg-soft rounded transition-colors"
              >+</button>
            </div>
          </div>

          {/* Rooms */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-semibold text-text-1">Rooms</span>
            <div className="flex items-center gap-3 border border-border rounded-md px-1 py-0.5">
              <button 
                type="button" 
                onClick={() => decrement(setRooms, rooms, 1)}
                className="w-6 h-6 flex items-center justify-center text-text-1 hover:bg-bg-soft rounded transition-colors disabled:opacity-30"
                disabled={rooms <= 1 || rooms <= Math.ceil(adults / 2)}
              >-</button>
              <span className="w-4 text-center text-[13px] font-semibold">{rooms}</span>
              <button 
                type="button" 
                onClick={() => increment(setRooms, rooms, 30)}
                className="w-6 h-6 flex items-center justify-center text-text-1 hover:bg-bg-soft rounded transition-colors disabled:opacity-30"
                disabled={rooms >= adults}
              >+</button>
            </div>
          </div>

          <button 
            type="button" 
            onClick={() => setIsOpen(false)}
            className="w-full bg-m2n-ink text-white text-[12px] font-bold py-2 rounded-md hover:bg-[#2a2a2a] transition-colors"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
