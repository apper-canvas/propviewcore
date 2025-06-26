import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import PropertyCard from '../molecules/PropertyCard';
import Button from '../atoms/Button';
import ApperIcon from '../atoms/ApperIcon';
import Badge from '../atoms/Badge';
import { savedPropertiesService } from '../../services/api/savedPropertiesService';
import { propertiesService } from '../../services/api/propertiesService';

const SavedPropertiesPage = () => {
  const [savedProperties, setSavedProperties] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('all');
  const [collections, setCollections] = useState([
    { id: 'default', name: 'Favorites', count: 0 },
    { id: 'shortlist', name: 'Shortlist', count: 0 },
    { id: 'tours', name: 'Schedule Tours', count: 0 }
  ]);

  useEffect(() => {
    loadSavedProperties();
  }, []);

  const loadSavedProperties = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load saved properties and all properties
      const [savedData, allProperties] = await Promise.all([
        savedPropertiesService.getAll(),
        propertiesService.getAll()
      ]);

      setSavedProperties(savedData);
      
      // Filter properties to only show saved ones
      const savedPropertyIds = savedData.map(sp => sp.propertyId);
      const filteredProperties = allProperties.filter(p => 
        savedPropertyIds.includes(p.id)
      );
      setProperties(filteredProperties);

      // Update collection counts
      const updatedCollections = collections.map(collection => ({
        ...collection,
        count: savedData.filter(sp => sp.collectionId === collection.id).length
      }));
      setCollections(updatedCollections);

    } catch (err) {
      setError('Failed to load saved properties');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProperty = async (propertyId) => {
    try {
      await savedPropertiesService.delete(propertyId);
      setSavedProperties(prev => prev.filter(sp => sp.propertyId !== propertyId));
      setProperties(prev => prev.filter(p => p.id !== propertyId));
      toast.success('Property removed from saved');
      
      // Update collection counts
      const updatedCollections = collections.map(collection => ({
        ...collection,
        count: Math.max(0, collection.count - (savedProperties.find(sp => sp.propertyId === propertyId && sp.collectionId === collection.id) ? 1 : 0))
      }));
      setCollections(updatedCollections);
    } catch (error) {
      toast.error('Failed to remove property');
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to remove all saved properties?')) {
      try {
        // Remove all saved properties
        for (const savedProperty of savedProperties) {
          await savedPropertiesService.delete(savedProperty.propertyId);
        }
        setSavedProperties([]);
        setProperties([]);
        setCollections(prev => prev.map(col => ({ ...col, count: 0 })));
        toast.success('All saved properties removed');
      } catch (error) {
        toast.error('Failed to clear saved properties');
      }
    }
  };

  const getFilteredProperties = () => {
    if (viewMode === 'all') return properties;
    
    const savedInCollection = savedProperties
      .filter(sp => sp.collectionId === viewMode)
      .map(sp => sp.propertyId);
    
    return properties.filter(p => savedInCollection.includes(p.id));
  };

  const filteredProperties = getFilteredProperties();
  const totalSaved = savedProperties.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
          >
            <div>
              <h1 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-2">
                Saved Properties
              </h1>
              <p className="text-lg text-gray-600">
                {totalSaved === 0 
                  ? "You haven't saved any properties yet" 
                  : `You have ${totalSaved} saved ${totalSaved === 1 ? 'property' : 'properties'}`
                }
              </p>
            </div>

            {totalSaved > 0 && (
              <div className="flex items-center space-x-3">
                <Button
                  onClick={handleClearAll}
                  variant="outline"
                  size="sm"
                >
                  <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
                <Link to="/properties">
                  <Button variant="primary" size="sm">
                    <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                    Find More Properties
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {totalSaved === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-primary rounded-full mb-6">
              <ApperIcon name="Heart" className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
              No Saved Properties Yet
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Start exploring our amazing properties and save your favorites to view them here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/properties">
                <Button variant="primary" size="lg">
                  <ApperIcon name="Search" className="w-5 h-5 mr-2" />
                  Browse Properties
                </Button>
              </Link>
              <Link to="/map">
                <Button variant="outline" size="lg">
                  <ApperIcon name="Map" className="w-5 h-5 mr-2" />
                  Explore Map
                </Button>
              </Link>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Collection Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center space-x-4 overflow-x-auto pb-2">
                <button
                  onClick={() => setViewMode('all')}
                  className={`flex items-center px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all duration-200 ${
                    viewMode === 'all'
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <ApperIcon name="Grid3X3" className="w-4 h-4 mr-2" />
                  All Properties
                  <Badge 
                    variant={viewMode === 'all' ? 'white' : 'default'} 
                    size="sm" 
                    className="ml-2"
                  >
                    {totalSaved}
                  </Badge>
                </button>

                {collections.map((collection) => (
                  <button
                    key={collection.id}
                    onClick={() => setViewMode(collection.id)}
                    className={`flex items-center px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all duration-200 ${
                      viewMode === collection.id
                        ? 'bg-primary-500 text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <ApperIcon 
                      name={collection.id === 'default' ? 'Heart' : collection.id === 'shortlist' ? 'Star' : 'Calendar'} 
                      className="w-4 h-4 mr-2" 
                    />
                    {collection.name}
                    <Badge 
                      variant={viewMode === collection.id ? 'white' : 'default'} 
                      size="sm" 
                      className="ml-2"
                    >
                      {collection.count}
                    </Badge>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Properties Grid */}
            {error ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                  <ApperIcon name="AlertCircle" className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Properties</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={loadSavedProperties} variant="primary">
                  Try Again
                </Button>
              </div>
            ) : filteredProperties.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <ApperIcon name="Search" className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Properties in This Collection
                </h3>
                <p className="text-gray-600 mb-4">
                  You haven't added any properties to this collection yet.
                </p>
                <Link to="/properties">
                  <Button variant="primary">
                    Browse Properties
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredProperties.map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <PropertyCard property={property} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SavedPropertiesPage;