import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getPlayers = async (skip = 0, limit = 100) => {
  try {
    const response = await api.get(`/players/?skip=${skip}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching players:', error);
    throw error;
  }
};

export const getPlayer = async (id) => {
  try {
    const response = await api.get(`/players/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching player ${id}:`, error);
    throw error;
  }
};

export const getGameCards = async (count = 10) => {
  try {
    const response = await api.get(`/game/cards?count=${count}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching game cards:', error);
    throw error;
  }
};

export default api; 