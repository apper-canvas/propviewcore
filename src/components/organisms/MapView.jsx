import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '../atoms/ApperIcon';
import Button from '../atoms/Button';
import Badge from '../atoms/Badge';

const MapView = ({ properties, selectedProperty, onPropertySelect }) => {
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 }); // NYC default
  const [zoom, setZoom] = useState(12);
  const [showPropertyList, setShowPropertyList] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Mock map implementation - in a real app, you'd use Google Maps, Mapbox, etc.
  const MapMarker = ({ property, isSelected, onClick }) => (
    <button
      onClick={() => onClick(property)}
      className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
        isSelected ? 'z-20 scale-110' : 'z-10 hover:scale-105'
      }`}
      style={{
        left: `${50 + (property.coordinates.lng * 10)}%`,
        top: `${50 + (property.coordinates.lat * 10)}%`
      }}
    >
      <div className={`relative ${isSelected ? 'animate-pulse' : ''}`}>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg transition-colors ${
          isSelected 
            ? 'bg-accent-500 text-white' 
            : 'bg-white text-gray-900 hover:bg-primary-50'
        }`}>
          {formatPrice(property.price)}
        </div>
        <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-transparent ${
          isSelected ? 'border-t-accent-500' : 'border-t-white'
        }`} />
      </div>
    </button>
  );

  return (
    <div className="relative h-full min-h-[600px] bg-gray-100 rounded-2xl overflow-hidden">
      {/* Mock Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100">
        {/* Simulated map streets */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#6B7280" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        
        {/* Map markers */}
        {properties.map((property) => (
          <MapMarker
            key={property.id}
            property={property}
            isSelected={selectedProperty?.id === property.id}
            onClick={onPropertySelect}
          />
        ))}
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
          <ApperIcon name="Plus" className="w-5 h-5 text-gray-600" />
        </button>
        <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
          <ApperIcon name="Minus" className="w-5 h-5 text-gray-600" />
        </button>
        <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
          <ApperIcon name="Locate" className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Toggle Property List Button (Mobile) */}
      <button
        onClick={() => setShowPropertyList(!showPropertyList)}
        className="absolute bottom-4 left-4 bg-white rounded-full px-4 py-2 shadow-lg flex items-center space-x-2 hover:bg-gray-50 transition-colors lg:hidden"
      >
        <ApperIcon name="List" className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          {showPropertyList ? 'Hide List' : 'Show List'}
        </span>
        <Badge variant="primary" size="sm">
          {properties.length}
        </Badge>
      </button>

      {/* Property List Overlay (Mobile) */}
      {showPropertyList && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-premium max-h-96 overflow-hidden lg:hidden"
        >
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Properties</h3>
              <button
                onClick={() => setShowPropertyList(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
          <div className="p-4 space-y-3 overflow-y-auto max-h-80">
            {properties.map((property) => (
              <button
                key={property.id}
                onClick={() => {
                  onPropertySelect(property);
                  setShowPropertyList(false);
                }}
                className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                  selectedProperty?.id === property.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">
                      {property.title}
                    </h4>
                    <p className="text-sm text-gray-600 truncate">
                      {property.address.street}, {property.address.city}
                    </p>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                      <span>{property.bedrooms} beds</span>
                      <span>{property.bathrooms} baths</span>
                      <span>{property.squareFeet?.toLocaleString()} sqft</span>
                    </div>
                    <p className="text-lg font-bold text-primary-600 mt-1">
                      {formatPrice(property.price)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Selected Property Card */}
      {selectedProperty && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-2xl shadow-premium p-4 max-w-sm w-full mx-4 hidden lg:block"
        >
          <div className="flex items-start space-x-4">
            <img
              src={selectedProperty.images[0]}
              alt={selectedProperty.title}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 truncate">
                {selectedProperty.title}
              </h4>
              <p className="text-sm text-gray-600 truncate">
                {selectedProperty.address.street}, {selectedProperty.address.city}
              </p>
              <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                <span>{selectedProperty.bedrooms} beds</span>
                <span>{selectedProperty.bathrooms} baths</span>
                <span>{selectedProperty.squareFeet?.toLocaleString()} sqft</span>
              </div>
              <p className="text-xl font-bold text-primary-600 mt-2">
                {formatPrice(selectedProperty.price)}
              </p>
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={() => window.open(`/property/${selectedProperty.id}`, '_blank')}
            >
              View Details
            </Button>
            <button className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
              <ApperIcon name="Heart" className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MapView;