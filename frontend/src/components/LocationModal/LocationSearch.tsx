import React, { useState, useEffect, useCallback } from 'react';
import { MdSearch, MdClose, MdMyLocation } from 'react-icons/md';
import { City } from '../../data/locationsData';
import { motion } from 'framer-motion';

interface LocationSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectLocation: (location: City) => void;
}

const LocationSearch: React.FC<LocationSearchProps> = ({
  searchQuery,
  setSearchQuery,
  onSelectLocation,
}) => {
  const [isLocating, setIsLocating] = useState(false);
  const [searchResults, setSearchResults] = useState<City[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Debounce for search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length > 2) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const performSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY || 'YOUR_GEOAPIFY_API_KEY';
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&type=city&filter=countrycode:in&format=json&apiKey=${API_KEY}`
      );
      const data = await response.json();
      
      const results: City[] = (data.results || []).map((item: any) => ({
        id: item.place_id || Math.random().toString(),
        name: item.city || item.name,
        state: item.state || item.country || '',
      }));
      
      setSearchResults(results);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY || 'YOUR_GEOAPIFY_API_KEY';
          const response = await fetch(
            `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${API_KEY}`
          );
          const data = await response.json();
          
          const result = data.results?.[0];
          const city = result?.city || result?.town || result?.village || result?.name || 'Current Location';
          const state = result?.state || result?.country || '';
          
          onSelectLocation({
            id: 'current-location',
            name: city,
            state: state,
          });
        } catch (error) {
          console.error('Error getting current location:', error);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to retrieve your location');
        setIsLocating(false);
      }
    );
  };

  return (
    <div className="relative space-y-4">
      {/* Input Field */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <MdSearch className="h-6 w-6 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search city, area or locality"
          className="block w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
          >
            <MdClose className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Use Current Location Button */}
      {!searchQuery && (
        <button
          onClick={handleCurrentLocation}
          disabled={isLocating}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          <MdMyLocation className={`w-5 h-5 ${isLocating ? 'animate-pulse' : ''}`} />
          <span>{isLocating ? 'Detecting location...' : 'Use Current Location'}</span>
        </button>
      )}

      {/* Search Results */}
      {searchQuery && (
        <div className="mt-4 space-y-2">
          {isSearching ? (
            <div className="text-gray-500 p-4 text-center">Searching...</div>
          ) : searchResults.length > 0 ? (
            searchResults.map((result) => (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={result.id}
                onClick={() => onSelectLocation(result)}
                className="w-full text-left p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200 flex flex-col"
              >
                <span className="font-medium text-gray-900">{result.name}</span>
                <span className="text-sm text-gray-500">{result.state}</span>
              </motion.button>
            ))
          ) : searchQuery.length > 2 ? (
            <div className="text-gray-500 p-4 text-center">No cities found.</div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
