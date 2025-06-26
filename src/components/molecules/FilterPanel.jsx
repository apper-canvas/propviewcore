import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '../atoms/ApperIcon';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import Badge from '../atoms/Badge';

const FilterPanel = ({ isOpen, onClose, filters, onFiltersChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const propertyTypes = [
    'House', 'Apartment', 'Condo', 'Townhouse', 'Land', 'Commercial'
  ];

  const amenities = [
    'Swimming Pool', 'Gym', 'Parking', 'Balcony', 'Garden', 'Fireplace',
    'Air Conditioning', 'Dishwasher', 'Washer/Dryer', 'Walk-in Closet'
  ];

  const handleFilterChange = (key, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePropertyTypeToggle = (type) => {
    const current = localFilters.propertyTypes || [];
    const updated = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type];
    handleFilterChange('propertyTypes', updated);
  };

  const handleAmenityToggle = (amenity) => {
    const current = localFilters.amenities || [];
    const updated = current.includes(amenity)
      ? current.filter(a => a !== amenity)
      : [...current, amenity];
    handleFilterChange('amenities', updated);
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      location: '',
      minPrice: '',
      maxPrice: '',
      propertyTypes: [],
      minBeds: '',
      minBaths: '',
      amenities: []
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (localFilters.location) count++;
    if (localFilters.minPrice) count++;
    if (localFilters.maxPrice) count++;
    if (localFilters.propertyTypes?.length) count++;
    if (localFilters.minBeds) count++;
    if (localFilters.minBaths) count++;
    if (localFilters.amenities?.length) count++;
    return count;
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Filter Panel */}
          <motion.div
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 h-full w-80 bg-white shadow-premium z-50 lg:relative lg:w-full lg:h-auto lg:shadow-none lg:bg-gray-50 lg:rounded-2xl"
          >
            <div className="p-6 h-full overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <h2 className="text-xl font-display font-semibold">Filters</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Location */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Location</h3>
                  <Input
                    placeholder="City, neighborhood, or address"
                    value={localFilters.location || ''}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                  />
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="Min price"
                      type="number"
                      value={localFilters.minPrice || ''}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    />
                    <Input
                      placeholder="Max price"
                      type="number"
                      value={localFilters.maxPrice || ''}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    />
                  </div>
                </div>

                {/* Property Type */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Property Type</h3>
                  <div className="flex flex-wrap gap-2">
                    {propertyTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => handlePropertyTypeToggle(type)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          localFilters.propertyTypes?.includes(type)
                            ? 'bg-primary-500 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bedrooms & Bathrooms */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Min Bedrooms</h3>
                    <select
                      value={localFilters.minBeds || ''}
                      onChange={(e) => handleFilterChange('minBeds', e.target.value)}
                      className="input-modern"
                    >
                      <option value="">Any</option>
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num}+</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Min Bathrooms</h3>
                    <select
                      value={localFilters.minBaths || ''}
                      onChange={(e) => handleFilterChange('minBaths', e.target.value)}
                      className="input-modern"
                    >
                      <option value="">Any</option>
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num}+</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Amenities</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {amenities.map((amenity) => (
                      <label key={amenity} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={localFilters.amenities?.includes(amenity) || false}
                          onChange={() => handleAmenityToggle(amenity)}
                          className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-400"
                        />
                        <span className="ml-3 text-sm text-gray-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-200 space-y-3">
                <Button
                  onClick={handleApplyFilters}
                  variant="primary"
                  className="w-full"
                >
                  Apply Filters
                  {getActiveFilterCount() > 0 && (
                    <Badge variant="white" size="sm" className="ml-2">
                      {getActiveFilterCount()}
                    </Badge>
                  )}
                </Button>
                <Button
                  onClick={handleClearFilters}
                  variant="outline"
                  className="w-full"
                >
                  Clear All
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterPanel;