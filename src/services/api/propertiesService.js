import propertiesData from '../mockData/properties.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const propertiesService = {
  async getAll() {
    await delay(300);
    return [...propertiesData];
  },

  async getById(id) {
    await delay(200);
    const property = propertiesData.find(p => p.id === id);
    if (!property) {
      throw new Error('Property not found');
    }
    return { ...property };
  },

  async create(propertyData) {
    await delay(400);
    const maxId = Math.max(...propertiesData.map(p => parseInt(p.id)), 0);
    const newProperty = {
      ...propertyData,
      id: (maxId + 1).toString(),
      listingDate: new Date().toISOString()
    };
    propertiesData.push(newProperty);
    return { ...newProperty };
  },

  async update(id, updates) {
    await delay(300);
    const index = propertiesData.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Property not found');
    }
    
    propertiesData[index] = { ...propertiesData[index], ...updates };
    return { ...propertiesData[index] };
  },

  async delete(id) {
    await delay(250);
    const index = propertiesData.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Property not found');
    }
    
    const deleted = propertiesData.splice(index, 1)[0];
    return { ...deleted };
  },

  async search(filters) {
    await delay(300);
    let results = [...propertiesData];

    if (filters.location) {
      results = results.filter(property =>
        property.address.city.toLowerCase().includes(filters.location.toLowerCase()) ||
        property.address.state.toLowerCase().includes(filters.location.toLowerCase()) ||
        property.address.street.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.minPrice) {
      results = results.filter(property => property.price >= filters.minPrice);
    }

    if (filters.maxPrice) {
      results = results.filter(property => property.price <= filters.maxPrice);
    }

    if (filters.propertyTypes?.length > 0) {
      results = results.filter(property =>
        filters.propertyTypes.includes(property.propertyType)
      );
    }

    if (filters.minBeds) {
      results = results.filter(property => property.bedrooms >= filters.minBeds);
    }

    if (filters.minBaths) {
      results = results.filter(property => property.bathrooms >= filters.minBaths);
    }

    return results;
  }
};