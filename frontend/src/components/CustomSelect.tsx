import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder: string;
  disabled?: boolean;
}

export default function CustomSelect({ value, onChange, options, placeholder, disabled }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`relative w-full ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`} ref={dropdownRef}>
      <div 
        className="flex items-center justify-between w-full mt-1 bg-transparent text-[13px] font-semibold text-text-1 outline-none"
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className="truncate pr-2">{selectedOption ? selectedOption.label : placeholder}</span>
        <FiChevronDown size={14} className={`text-text-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 z-50 w-full mt-2 bg-white border border-border rounded-md shadow-lg overflow-hidden py-1 max-h-60 overflow-y-auto">
          {options.length === 0 ? (
            <div className="px-4 py-2 text-[13px] text-text-3 text-center">No options available</div>
          ) : (
            options.map((option) => (
              <div
                key={option.value}
                className={`px-4 py-2 text-[13px] font-semibold cursor-pointer transition-colors ${
                  value === option.value 
                    ? 'bg-m2n-saffron/10 text-m2n-saffron' 
                    : 'text-text-1 hover:bg-m2n-saffron/5'
                }`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
