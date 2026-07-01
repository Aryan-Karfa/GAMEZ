import api from './api.js';

/**
 * Fetch user preferences from the backend.
 */
export const getPreferences = async () => {
  const res = await api.get('/preferences');
  return res.data;
};

/**
 * Update user preferences on the backend.
 */
export const updatePreferences = async (updates) => {
  const res = await api.patch('/preferences', updates);
  return res.data;
};
