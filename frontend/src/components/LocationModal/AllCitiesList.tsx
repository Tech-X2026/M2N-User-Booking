import React, { useState, useMemo } from 'react';
import { City, allCities } from '../../data/locationsData';

interface AllCitiesListProps {
  onSelectLocation: (location: City) => void;
}

const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const AllCitiesList: React.FC<AllCitiesListProps> = ({ onSelectLocation }) => {
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  const filteredCities = useMemo(() => {
    if (!activeLetter) return allCities;
    return allCities.filter((city) =>
      city.name.toUpperCase().startsWith(activeLetter)
    );
  }, [activeLetter]);

  return (
    <div className="space-y-6">
      {/* Alphabet Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveLetter(null)}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
            activeLetter === null
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          All
        </button>
        {alphabets.map((letter) => {
          // Check if we have any cities starting with this letter to disable empty letters (optional UX enhancement)
          const hasCities = allCities.some((c) => c.name.toUpperCase().startsWith(letter));
          
          return (
            <button
              key={letter}
              onClick={() => hasCities && setActiveLetter(letter)}
              disabled={!hasCities}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                activeLetter === letter
                  ? 'bg-blue-600 text-white shadow-md'
                  : hasCities
                  ? 'text-gray-600 hover:bg-gray-100'
                  : 'text-gray-300 cursor-not-allowed'
              }`}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {/* Cities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-3">
        {filteredCities.map((city) => (
          <button
            key={city.id}
            onClick={() => onSelectLocation(city)}
            className="text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            {city.name}
          </button>
        ))}
      </div>
      
      {filteredCities.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No cities found starting with {activeLetter}.
        </div>
      )}
    </div>
  );
};

export default AllCitiesList;
