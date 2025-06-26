import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import MapView from '../organisms/MapView';
import FilterPanel from '../molecules/FilterPanel';
import Button from '../atoms/Button';
import ApperIcon from '../atoms/ApperIcon';
import Badge from '../atoms/Badge';
import { propertiesService } from '../../services/api/propertiesService';

const MapViewPage = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showPropertyList, setShowPropertyList] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    propertyTypes: [],
    minBeds: '',
    minBaths: '',
    amenities: []
  });

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [properties, filters]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await propertiesService.getAll();
      setProperties(data);
    } catch (err) {
      setError('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...properties];

    if (filters.location) {
      filtered = filtered.filter(property =>
        property.address.city.toLowerCase().includes(filters.location.toLowerCase()) ||
        property.address.state.toLowerCase().includes(filters.location.toLowerCase()) ||
        property.address.street.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.minPrice) {
      filtered = filtered.filter(property => property.price >= parseInt(filters.minPrice));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(property => property.price <= parseInt(filters.maxPrice));
    }

    if (filters.propertyTypes?.length > 0) {
      filtered = filtered.filter(property =>
        filters.propertyTypes.includes(property.propertyType)
      );
    }

    if (filters.minBeds) {
      filtered = filtered.filter(property => property.bedrooms >= parseInt(filters.minBeds));
    }

    if (filters.minBaths) {
      filtered = filtered.filter(property => property.bathrooms >= parseInt(filters.minBaths));
    }

    if (filters.amenities?.length > 0) {
      filtered = filtered.filter(property =>
        filters.amenities.some(amenity => property.features?.includes(amenity))
      );
    }

    setFilteredProperties(filtered);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handlePropertySelect = (property) => {
    setSelectedProperty(property);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.location) count++;
    if (filters.minPrice) count++;
    if (filters.maxPrice) count++;
    if (filters.propertyTypes?.length) count++;
    if (filters.minBeds) count++;
    if (filters.minBaths) count++;
    if (filters.amenities?.length) count++;
    return count;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <ApperIcon name="Map" className="w-8 h-8 text-primary-600 animate-pulse" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Map</h3>
          <p className="text-gray-600">Please wait while we load the properties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <ApperIcon name="AlertCircle" className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Map</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadProperties} variant="primary">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-display font-bold text-gray-900">
                Property Map View
              </h1>
              <p className="text-gray-600 mt-1">
                Explore {filteredProperties.length} properties on the interactive map
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setIsFilterOpen(true)}
                variant="outline"
                size="sm"
              >
                <ApperIcon name="Filter" className="w-4 h-4 mr-2" />
                Filters
                {getActiveFilterCount() > 0 && (
                  <Badge variant="primary" size="sm" className="ml-2">
                    {getActiveFilterCount()}
                  </Badge>
                )}
              </Button>

              <Button
                onClick={() => setShowPropertyList(!showPropertyList)}
                variant={showPropertyList ? "primary" : "outline"}
                size="sm"
                className="lg:hidden"
              >
                <ApperIcon name="List" className="w-4 h-4 mr-2" />
                List
              </Button>

              <Link to="/properties">
                <Button variant="ghost" size="sm">
                  <ApperIcon name="Grid3X3" className="w-4 h-4 mr-2" />
                  Grid View
                </Button>
              </Link>
            </div>
          </div>

          {/* Active Filters */}
          {getActiveFilterCount() > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex flex-wrap gap-2"
            >
              {filters.location && (
                <Badge variant="primary" className="flex items-center space-x-2">
                  <span>Location: {filters.location}</span>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, location: '' }))}
                    className="hover:bg-primary-600 rounded-full p-0.5"
                  >
                    <ApperIcon name="X" className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.minPrice && (
                <Badge variant="primary" className="flex items-center space-x-2">
                  <span>Min: ${parseInt(filters.minPrice).toLocaleString()}</span>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, minPrice: '' }))}
                    className="hover:bg-primary-600 rounded-full p-0.5"
                  >
                    <ApperIcon name="X" className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.maxPrice && (
                <Badge variant="primary" className="flex items-center space-x-2">
                  <span>Max: ${parseInt(filters.maxPrice).toLocaleString()}</span>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, maxPrice: '' }))}
                    className="hover:bg-primary-600 rounded-full p-0.5"
                  >
                    <ApperIcon name="X" className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.propertyTypes?.map(type => (
                <Badge key={type} variant="primary" className="flex items-center space-x-2">
                  <span>{type}</span>
                  <button
                    onClick={() => setFilters(prev => ({
                      ...prev,
                      propertyTypes: prev.propertyTypes.filter(t => t !== type)
                    }))}
                    className="hover:bg-primary-600 rounded-full p-0.5"
                  >
                    <ApperIcon name="X" className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-screen">
        {/* Desktop Property List Sidebar */}
        <div className="hidden lg:block w-96 bg-white border-r border-gray-200 overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">
                Properties ({filteredProperties.length})
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredProperties.map((property) => (
                <button
                  key={property.id}
                  onClick={() => handlePropertySelect(property)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 hover-lift ${
                    selectedProperty?.id === property.id
                      ? 'border-primary-500 bg-primary-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate mb-1">
                        {property.title}
                      </h3>
                      <p className="text-sm text-gray-600 truncate mb-2">
                        {property.address.street}, {property.address.city}
                      </p>
                      <div className="flex items-center space-x-3 text-xs text-gray-500 mb-2">
                        <span>{property.bedrooms} beds</span>
                        <span>{property.bathrooms} baths</span>
                        <span>{property.squareFeet?.toLocaleString()} sqft</span>
                      </div>
                      <p className="text-lg font-bold text-primary-600">
                        {formatPrice(property.price)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}

              {filteredProperties.length === 0 && (
                <div className="text-center py-8">
                  <ApperIcon name="Search" className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No properties match your filters</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <MapView
            properties={filteredProperties}
            selectedProperty={selectedProperty}
            onPropertySelect={handlePropertySelect}
          />
        </div>
      </div>

      {/* Filter Panel */}
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />
    </div>
  );
};

export default MapViewPage;