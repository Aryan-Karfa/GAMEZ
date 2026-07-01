import api from './api.js';

export const getLibrary = async () => {
  const res = await api.get('/library');
  return res.data;
};

export const getEntryDetails = async (id) => {
  const res = await api.get(`/library/${id}`);
  return res.data;
};

export const addGame = async (rawgId, status) => {
  const res = await api.post('/library', { rawgId, status });
  return res.data;
};

export const updateEntry = async (id, updates) => {
  const res = await api.patch(`/library/${id}`, updates);
  return res.data;
};

export const deleteEntry = async (id) => {
  const res = await api.delete(`/library/${id}`);
  return res.data;
};
