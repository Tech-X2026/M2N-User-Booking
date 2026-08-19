import React from 'react';
import { motion } from 'framer-motion';
import { City, popularCities } from '../../data/locationsData';
import { MdOutlineDomain } from 'react-icons/md';

interface PopularCitiesProps {
  onSelectLocation: (location: City) => void;
}

// A simple placeholder icon component since we don't have custom SVGs yet
const CityIconPlaceholder = () => (
  <div className="w-12 h-12 mb-3 text-blue-500 opacity-80 flex items-center justify-center bg-blue-50 rounded-full">
    <MdOutlineDomain className="w-6 h-6" />
  </div>
);

const PopularCities: React.FC<PopularCitiesProps> = ({ onSelectLocation }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {popularCities.map((city, index) => (
        <motion.button
          key={city.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onSelectLocation(city)}
          className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-transparent hover:border-blue-100 transition-all group"
        >
          <div className="transform group-hover:-translate-y-1 transition-transform">
            {/* Replace this with actual SVGs later */}
            <CityIconPlaceholder />
          </div>
          <span className="text-sm font-medium text-gray-800 text-center">
            {city.name}
          </span>
        </motion.button>
      ))}
    </div>
  );
};

export default PopularCities;
