import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '../atoms/ApperIcon';
import Badge from '../atoms/Badge';
import { savedPropertiesService } from '../../services/api/savedPropertiesService';
import { toast } from 'react-toastify';

const PropertyCard = ({ property }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleSaveToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
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

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="card-premium group"
    >
      <Link to={`/property/${property.id}`} className="block">
        {/* Image Section */}
        <div className="relative h-64 overflow-hidden rounded-t-2xl">
          <img
            src={property.images[currentImageIndex]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Image Navigation */}
          {property.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center hover:bg-black/70"
              >
                <ApperIcon name="ChevronLeft" className="w-4 h-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center hover:bg-black/70"
              >
                <ApperIcon name="ChevronRight" className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Save Button */}
          <button
            onClick={handleSaveToggle}
            className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200 shadow-lg"
          >
            <ApperIcon 
              name="Heart" 
              className={`w-5 h-5 ${
                isSaved 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-gray-600 hover:text-red-500'
              } transition-colors duration-200`}
            />
          </button>

          {/* Property Type Badge */}
          <div className="absolute top-3 left-3">
            <Badge variant="gradient" size="sm">
              {property.propertyType}
            </Badge>
          </div>

          {/* Image Indicators */}
          {property.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1">
              {property.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-4">
          {/* Price */}
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-display font-bold text-gradient">
              {formatPrice(property.price)}
            </h3>
            {property.listingDate && (
              <span className="text-sm text-gray-500">
                Listed {new Date(property.listingDate).toLocaleDateString()}
              </span>
            )}
          </div>

          {/* Title */}
          <h4 className="font-display text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
            {property.title}
          </h4>

          {/* Address */}
          <div className="flex items-center text-gray-600">
            <ApperIcon name="MapPin" className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="text-sm">
              {property.address.street}, {property.address.city}, {property.address.state}
            </span>
          </div>

          {/* Property Details */}
          <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <ApperIcon name="Bed" className="w-4 h-4 mr-1" />
                <span>{property.bedrooms} beds</span>
              </div>
              <div className="flex items-center">
                <ApperIcon name="Bath" className="w-4 h-4 mr-1" />
                <span>{property.bathrooms} baths</span>
              </div>
              <div className="flex items-center">
                <ApperIcon name="Square" className="w-4 h-4 mr-1" />
                <span>{property.squareFeet?.toLocaleString()} sqft</span>
              </div>
            </div>
            {property.yearBuilt && (
              <span className="text-gray-500">Built {property.yearBuilt}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PropertyCard;