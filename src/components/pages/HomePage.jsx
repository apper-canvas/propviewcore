import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SearchBar from '../molecules/SearchBar';
import PropertyCard from '../molecules/PropertyCard';
import Button from '../atoms/Button';
import ApperIcon from '../atoms/ApperIcon';
import Badge from '../atoms/Badge';
import { propertiesService } from '../../services/api/propertiesService';

const HomePage = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadFeaturedProperties();
  }, []);

  const loadFeaturedProperties = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await propertiesService.getAll();
      // Get first 6 properties as featured
      setFeaturedProperties(data.slice(0, 6));
    } catch (err) {
      setError('Failed to load featured properties');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    // Navigate to properties page with search query
    window.location.href = `/properties?search=${encodeURIComponent(query)}`;
  };

  const stats = [
    { label: 'Active Listings', value: '12,000+', icon: 'Home' },
    { label: 'Cities Covered', value: '150+', icon: 'MapPin' },
    { label: 'Happy Clients', value: '25,000+', icon: 'Users' },
    { label: 'Years Experience', value: '15+', icon: 'Award' }
  ];

  const features = [
    {
      icon: 'Search',
      title: 'Advanced Search',
      description: 'Find your perfect property with powerful filters and smart recommendations.'
    },
    {
      icon: 'Map',
      title: 'Interactive Maps',
      description: 'Explore neighborhoods and properties with our detailed map interface.'
    },
    {
      icon: 'Heart',
      title: 'Save Favorites',
      description: 'Create collections of your favorite properties and get instant updates.'
    },
    {
      icon: 'TrendingUp',
      title: 'Market Insights',
      description: 'Access real-time market data and property value trends.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl lg:text-6xl font-display font-bold text-white mb-6">
              Find Your Dream Home with{' '}
              <span className="text-gradient-accent">PropView</span>
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 mb-12 leading-relaxed">
              Discover premium real estate listings with advanced search, interactive maps, 
              and detailed neighborhood insights.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16"
          >
            <SearchBar onSearch={handleSearch} />
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl mb-4">
                  <ApperIcon name={stat.icon} className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl lg:text-4xl font-display font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-white/80 text-sm lg:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-accent-400/20 rounded-full blur-xl"></div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="primary" size="md" className="mb-4">
              Featured Properties
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-display font-bold text-gray-900 mb-6">
              Discover Premium Listings
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our handpicked selection of exceptional properties, 
              from luxury homes to smart investments.
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="card-premium animate-pulse">
                  <div className="h-64 bg-gray-200 rounded-t-2xl"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <ApperIcon name="AlertCircle" className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Properties</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={loadFeaturedProperties} variant="primary">
                Try Again
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/properties">
              <Button variant="primary" size="lg">
                View All Properties
                <ApperIcon name="ArrowRight" className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="accent" size="md" className="mb-4">
              Why Choose PropView
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-display font-bold text-gray-900 mb-6">
              Premium Real Estate Experience
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine cutting-edge technology with deep market expertise 
              to deliver an unmatched property discovery experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-premium text-center p-8 hover-lift"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-6">
                  <ApperIcon name={feature.icon} className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-display font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-5xl font-display font-bold text-white mb-6">
              Ready to Find Your Next Home?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Join thousands of satisfied clients who found their perfect property with PropView.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/properties">
                <Button variant="white" size="lg">
                  Start Searching
                  <ApperIcon name="Search" className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600">
                List Your Property
                <ApperIcon name="Plus" className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-accent-400/20 rounded-full blur-xl"></div>
      </section>
    </div>
  );
};

export default HomePage;