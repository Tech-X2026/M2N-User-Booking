import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose } from 'react-icons/md';
import LocationSearch from './LocationSearch';
import PopularCities from './PopularCities';
import AllCitiesList from './AllCitiesList';
import { City } from '../../data/locationsData';

interface LocationSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (location: City) => void;
}

const LocationSelectionModal: React.FC<LocationSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectLocation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSelect = (city: City) => {
    onSelectLocation(city);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] pointer-events-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800">Select Location</h2>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <MdClose className="w-6 h-6" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                {/* Search & Current Location */}
                <div className="space-y-4">
                  <LocationSearch
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onSelectLocation={handleSelect}
                  />
                </div>

                {/* Popular Cities */}
                {!searchQuery && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">
                      Popular Cities
                    </h3>
                    <PopularCities onSelectLocation={handleSelect} />
                  </div>
                )}

                {/* All Cities */}
                {!searchQuery && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">
                      All Cities
                    </h3>
                    <AllCitiesList onSelectLocation={handleSelect} />
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LocationSelectionModal;
