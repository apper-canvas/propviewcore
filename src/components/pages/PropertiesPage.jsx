import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SearchBar from '../molecules/SearchBar';
import FilterPanel from '../molecules/FilterPanel';
import PropertyGrid from '../organisms/PropertyGrid';
import Button from '../atoms/Button';
import ApperIcon from '../atoms/ApperIcon';
import Badge from '../atoms/Badge';
import { propertiesService } from '../../services/api/propertiesService';

const PropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
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
    applyFiltersAndSort();
  }, [properties, filters, sortBy]);

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

  const applyFiltersAndSort = () => {
    let filtered = [...properties];

    // Apply filters
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

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'size-large':
        filtered.sort((a, b) => (b.squareFeet || 0) - (a.squareFeet || 0));
        break;
      case 'size-small':
        filtered.sort((a, b) => (a.squareFeet || 0) - (b.squareFeet || 0));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.listingDate) - new Date(a.listingDate));
        break;
    }

    setFilteredProperties(filtered);
  };

  const handleSearch = (query) => {
    setFilters(prev => ({ ...prev, location: query }));
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
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

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'size-large', label: 'Size: Largest First' },
    { value: 'size-small', label: 'Size: Smallest First' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-2">
                Property Listings
              </h1>
              <p className="text-lg text-gray-600">
                Discover your perfect home from our extensive collection of premium properties
              </p>
            </div>

            <SearchBar onSearch={handleSearch} />
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <FilterPanel
                isOpen={true}
                onClose={() => {}}
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 p-4 bg-white rounded-2xl shadow-card"
            >
              <div className="flex items-center space-x-4">
                {/* Mobile Filter Button */}
                <Button
                  onClick={() => setIsFilterOpen(true)}
                  variant="outline"
                  className="lg:hidden"
                >
                  <ApperIcon name="Filter" className="w-4 h-4 mr-2" />
                  Filters
                  {getActiveFilterCount() > 0 && (
                    <Badge variant="primary" size="sm" className="ml-2">
                      {getActiveFilterCount()}
                    </Badge>
                  )}
                </Button>

                {/* Results Count */}
                <div className="text-sm text-gray-600">
                  {loading ? (
                    'Loading...'
                  ) : (
                    `${filteredProperties.length} ${filteredProperties.length === 1 ? 'property' : 'properties'} found`
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-modern text-sm py-2 pr-8"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* View Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <ApperIcon name="Grid3X3" className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list'
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <ApperIcon name="List" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Active Filters */}
            {getActiveFilterCount() > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <div className="flex flex-wrap gap-2">
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
                </div>
              </motion.div>
            )}

            {/* Property Grid */}
            <PropertyGrid
              properties={filteredProperties}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      </div>

      {/* Mobile Filter Panel */}
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />
    </div>
  );
};

export default PropertiesPage;