// frontend/src/api/properties.ts
import api from '../services/api';

// ✅ GET ALL PROPERTIES
export const getProperties = async () => {
  return api.get('/properties');
};

// ✅ GET SINGLE PROPERTY
export const getProperty = async (id: string) => {
  return api.get(`/properties/${id}`);
};

// ✅ GET PROPERTY WITH DETAILS
export const getPropertyDetails = async (id: string) => {
  return api.get(`/properties/${id}/details`);
};
