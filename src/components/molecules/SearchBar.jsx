import { useState } from 'react';
import ApperIcon from '../atoms/ApperIcon';
import Button from '../atoms/Button';

const SearchBar = ({ onSearch, placeholder = "Search by location, property type, or features..." }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex w-full max-w-4xl mx-auto">
      <div className="relative flex-1">
        <ApperIcon 
          name="Search" 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" 
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-4 text-lg border border-gray-200 rounded-l-2xl focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-white shadow-inner-soft"
        />
      </div>
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="rounded-l-none rounded-r-2xl px-8"
      >
        <ApperIcon name="Search" className="w-5 h-5 mr-2" />
        Search
      </Button>
    </form>
  );
};

export default SearchBar;