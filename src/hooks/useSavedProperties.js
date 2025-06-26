import { useState, useEffect } from 'react';
import { savedPropertiesService } from '../services/api/savedPropertiesService';

export const useSavedProperties = () => {
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSavedProperties();
  }, []);

  const loadSavedProperties = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await savedPropertiesService.getAll();
      setSavedProperties(data);
    } catch (err) {
      setError('Failed to load saved properties');
    } finally {
      setLoading(false);
    }
  };

  const saveProperty = async (propertyId, collectionId = 'default', notes = '') => {
    try {
      const savedProperty = await savedPropertiesService.create({
        propertyId,
        collectionId,
        notes
      });
      setSavedProperties(prev => [...prev, savedProperty]);
      return savedProperty;
    } catch (err) {
      throw new Error('Failed to save property');
    }
  };

  const unsaveProperty = async (propertyId) => {
    try {
      await savedPropertiesService.delete(propertyId);
      setSavedProperties(prev => prev.filter(sp => sp.propertyId !== propertyId));
    } catch (err) {
      throw new Error('Failed to unsave property');
    }
  };

  const isPropertySaved = (propertyId) => {
    return savedProperties.some(sp => sp.propertyId === propertyId);
  };

  const getSavedPropertyByCollection = (collectionId) => {
    return savedProperties.filter(sp => sp.collectionId === collectionId);
  };

  return {
    savedProperties,
    loading,
    error,
    saveProperty,
    unsaveProperty,
    isPropertySaved,
    getSavedPropertyByCollection,
    refetch: loadSavedProperties
  };
};