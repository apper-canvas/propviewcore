import savedPropertiesData from '../mockData/savedProperties.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const savedPropertiesService = {
  async getAll() {
    await delay(200);
    return [...savedPropertiesData];
  },

  async getById(id) {
    await delay(150);
    const savedProperty = savedPropertiesData.find(sp => sp.id === parseInt(id));
    if (!savedProperty) {
      throw new Error('Saved property not found');
    }
    return { ...savedProperty };
  },

  async create(savedPropertyData) {
    await delay(300);
    const maxId = Math.max(...savedPropertiesData.map(sp => sp.id), 0);
    const newSavedProperty = {
      ...savedPropertyData,
      id: maxId + 1,
      savedDate: new Date().toISOString()
    };
    savedPropertiesData.push(newSavedProperty);
    return { ...newSavedProperty };
  },

  async update(id, updates) {
    await delay(250);
    const index = savedPropertiesData.findIndex(sp => sp.id === parseInt(id));
    if (index === -1) {
      throw new Error('Saved property not found');
    }
    
    savedPropertiesData[index] = { ...savedPropertiesData[index], ...updates };
    return { ...savedPropertiesData[index] };
  },

  async delete(propertyId) {
    await delay(200);
    const index = savedPropertiesData.findIndex(sp => sp.propertyId === propertyId);
    if (index === -1) {
      throw new Error('Saved property not found');
    }
    
    const deleted = savedPropertiesData.splice(index, 1)[0];
    return { ...deleted };
  },

  async getByCollection(collectionId) {
    await delay(200);
    return savedPropertiesData.filter(sp => sp.collectionId === collectionId).map(sp => ({ ...sp }));
  },

  async addToCollection(propertyId, collectionId, notes = '') {
    await delay(250);
    
    // Check if already saved in this collection
    const existing = savedPropertiesData.find(sp => 
      sp.propertyId === propertyId && sp.collectionId === collectionId
    );
    
    if (existing) {
      return { ...existing };
    }

    const maxId = Math.max(...savedPropertiesData.map(sp => sp.id), 0);
    const newSavedProperty = {
      id: maxId + 1,
      propertyId,
      savedDate: new Date().toISOString(),
      notes,
      collectionId
    };
    
    savedPropertiesData.push(newSavedProperty);
    return { ...newSavedProperty };
  }
};