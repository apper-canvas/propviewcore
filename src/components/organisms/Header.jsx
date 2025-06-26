import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '../atoms/ApperIcon';
import Button from '../atoms/Button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Search', href: '/properties', icon: 'Search' },
    { name: 'Map View', href: '/map', icon: 'Map' },
    { name: 'Saved', href: '/saved', icon: 'Heart' }
  ];

  const isActive = (href) => {
    if (href === '/properties' && (location.pathname === '/properties' || location.pathname === '/')) {
      return true;
    }
    return location.pathname === href;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-glass border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
              <ApperIcon name="Home" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-gradient">
                PropView
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Premium Real Estate</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                }`}
              >
                <ApperIcon name={item.icon} className="w-4 h-4 mr-2" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <ApperIcon name="User" className="w-4 h-4 mr-2" />
              Sign In
            </Button>
            <Button variant="primary" size="sm">
              List Property
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-primary-50 transition-colors"
          >
            <ApperIcon 
              name={isMobileMenuOpen ? 'X' : 'Menu'} 
              className="w-6 h-6 text-gray-700" 
            />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-gray-200 py-4"
          >
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-700 hover:bg-primary-50'
                  }`}
                >
                  <ApperIcon name={item.icon} className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
              <Button variant="outline" className="w-full justify-center">
                <ApperIcon name="User" className="w-4 h-4 mr-2" />
                Sign In
              </Button>
              <Button variant="primary" className="w-full justify-center">
                List Property
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;