import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ImageGallery from '../molecules/ImageGallery';
import Button from '../atoms/Button';
import ApperIcon from '../atoms/ApperIcon';
import Badge from '../atoms/Badge';
import { propertiesService } from '../../services/api/propertiesService';
import { savedPropertiesService } from '../../services/api/savedPropertiesService';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await propertiesService.getById(id);
      setProperty(data);
    } catch (err) {
      setError('Property not found');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToggle = async () => {
    try {
      if (isSaved) {
        await savedPropertiesService.delete(property.id);
        setIsSaved(false);
        toast.success('Property removed from saved');
      } else {
        await savedPropertiesService.create({
          propertyId: property.id,
          savedDate: new Date().toISOString(),
          notes: '',
          collectionId: 'default'
        });
        setIsSaved(true);
        toast.success('Property saved successfully');
      }
    } catch (error) {
      toast.error('Failed to update saved properties');
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send the contact form
    toast.success('Your message has been sent to the property agent!');
    setShowContactForm(false);
    setContactForm({ name: '', email: '', phone: '', message: '' });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculateMortgage = (price) => {
    const downPayment = price * 0.2; // 20% down
    const loanAmount = price - downPayment;
    const monthlyRate = 0.05 / 12; // 5% annual rate
    const months = 30 * 12; // 30 years
    const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                          (Math.pow(1 + monthlyRate, months) - 1);
    return monthlyPayment;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-96 bg-gray-200 rounded-2xl"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-40 bg-gray-200 rounded-2xl"></div>
                <div className="h-32 bg-gray-200 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <ApperIcon name="AlertCircle" className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">Property Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/properties">
            <Button variant="primary">
              <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
              Back to Properties
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-primary-600">Home</Link>
            <ApperIcon name="ChevronRight" className="w-4 h-4 text-gray-400" />
            <Link to="/properties" className="text-gray-500 hover:text-primary-600">Properties</Link>
            <ApperIcon name="ChevronRight" className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium truncate">{property.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <Badge variant="gradient">{property.propertyType}</Badge>
                {property.yearBuilt && (
                  <Badge variant="default">Built {property.yearBuilt}</Badge>
                )}
              </div>
              <h1 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 mb-4">
                {property.title}
              </h1>
              <div className="flex items-center text-gray-600 mb-4">
                <ApperIcon name="MapPin" className="w-5 h-5 mr-2" />
                <span>{property.address.street}, {property.address.city}, {property.address.state} {property.address.zipCode}</span>
              </div>
              <div className="text-4xl font-display font-bold text-gradient mb-4">
                {formatPrice(property.price)}
              </div>
              <div className="flex items-center space-x-6 text-gray-600">
                <div className="flex items-center">
                  <ApperIcon name="Bed" className="w-5 h-5 mr-2" />
                  <span className="font-medium">{property.bedrooms}</span>
                  <span className="ml-1">beds</span>
                </div>
                <div className="flex items-center">
                  <ApperIcon name="Bath" className="w-5 h-5 mr-2" />
                  <span className="font-medium">{property.bathrooms}</span>
                  <span className="ml-1">baths</span>
                </div>
                <div className="flex items-center">
                  <ApperIcon name="Square" className="w-5 h-5 mr-2" />
                  <span className="font-medium">{property.squareFeet?.toLocaleString()}</span>
                  <span className="ml-1">sqft</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                onClick={handleSaveToggle}
                variant={isSaved ? "accent" : "outline"}
                className="flex items-center"
              >
                <ApperIcon 
                  name="Heart" 
                  className={`w-4 h-4 mr-2 ${isSaved ? 'fill-current' : ''}`} 
                />
                {isSaved ? 'Saved' : 'Save'}
              </Button>
              <Button variant="ghost">
                <ApperIcon name="Share" className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Image Gallery */}
          <ImageGallery images={property.images} title={property.title} />

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Property Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className="card-premium p-6">
                <h2 className="text-2xl font-display font-semibold text-gray-900 mb-4">
                  About This Property
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Features & Amenities */}
              {property.features && property.features.length > 0 && (
                <div className="card-premium p-6">
                  <h2 className="text-2xl font-display font-semibold text-gray-900 mb-4">
                    Features & Amenities
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <ApperIcon name="Check" className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Property Details Grid */}
              <div className="card-premium p-6">
                <h2 className="text-2xl font-display font-semibold text-gray-900 mb-4">
                  Property Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Property Type</span>
                      <span className="font-medium text-gray-900">{property.propertyType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Year Built</span>
                      <span className="font-medium text-gray-900">{property.yearBuilt || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Square Feet</span>
                      <span className="font-medium text-gray-900">{property.squareFeet?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bedrooms</span>
                      <span className="font-medium text-gray-900">{property.bedrooms}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bathrooms</span>
                      <span className="font-medium text-gray-900">{property.bathrooms}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Listed Date</span>
                      <span className="font-medium text-gray-900">
                        {new Date(property.listingDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price per Sqft</span>
                      <span className="font-medium text-gray-900">
                        ${Math.round(property.price / property.squareFeet).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Property ID</span>
                      <span className="font-medium text-gray-900">#{property.id}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Agent */}
              <div className="card-premium p-6">
                <h3 className="text-xl font-display font-semibold text-gray-900 mb-4">
                  Contact Agent
                </h3>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-3">
                    <ApperIcon name="User" className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Sarah Johnson</h4>
                  <p className="text-sm text-gray-600">Licensed Real Estate Agent</p>
                  <div className="flex items-center justify-center mt-2">
                    {[...Array(5)].map((_, i) => (
                      <ApperIcon key={i} name="Star" className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">4.9 (127 reviews)</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button
                    onClick={() => setShowContactForm(true)}
                    variant="primary"
                    className="w-full"
                  >
                    <ApperIcon name="Mail" className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline" className="w-full">
                    <ApperIcon name="Phone" className="w-4 h-4 mr-2" />
                    (555) 123-4567
                  </Button>
                  <Button variant="accent" className="w-full">
                    <ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
                    Schedule Tour
                  </Button>
                </div>
              </div>

              {/* Mortgage Calculator */}
              <div className="card-premium p-6">
                <h3 className="text-xl font-display font-semibold text-gray-900 mb-4">
                  Estimated Monthly Payment
                </h3>
                <div className="space-y-4">
                  <div className="text-3xl font-display font-bold text-gradient">
                    ${Math.round(calculateMortgage(property.price)).toLocaleString()}
                    <span className="text-base font-normal text-gray-600">/month</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Principal & Interest</span>
                      <span className="font-medium">${Math.round(calculateMortgage(property.price)).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Property Tax</span>
                      <span className="font-medium">${Math.round(property.price * 0.012 / 12).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Insurance</span>
                      <span className="font-medium">${Math.round(property.price * 0.003 / 12).toLocaleString()}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
                      <span>Total Monthly</span>
                      <span>${Math.round(calculateMortgage(property.price) + (property.price * 0.015 / 12)).toLocaleString()}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    *Estimate based on 20% down, 5% APR, 30-year loan
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="card-premium p-6">
                <h3 className="text-xl font-display font-semibold text-gray-900 mb-4">
                  Neighborhood Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ApperIcon name="TrendingUp" className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm text-gray-600">Price Trend</span>
                    </div>
                    <span className="text-sm font-medium text-green-600">+5.2% this year</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ApperIcon name="Clock" className="w-4 h-4 text-blue-500 mr-2" />
                      <span className="text-sm text-gray-600">Avg. Days on Market</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">28 days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ApperIcon name="Home" className="w-4 h-4 text-purple-500 mr-2" />
                      <span className="text-sm text-gray-600">Similar Properties</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">156 nearby</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-premium max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-display font-semibold text-gray-900">
                Contact Agent
              </h3>
              <button
                onClick={() => setShowContactForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                  className="input-modern"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                  className="input-modern"
                  required
                />
              </div>
              <input
                type="tel"
                placeholder="Phone Number"
                value={contactForm.phone}
                onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                className="input-modern"
              />
              <textarea
                placeholder={`I'm interested in ${property.title}. Please contact me with more information.`}
                value={contactForm.message}
                onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                className="input-modern h-24 resize-none"
                required
              />
              <div className="flex space-x-3">
                <Button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="flex-1">
                  Send Message
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetailPage;