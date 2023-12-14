import axios from 'axios';

const API_BASE = process.env.REACT_APP_APIENDPOINT || 'http://localhost:4000/api/users';

const api = axios.create({
  withCredentials: true,
});

export const registerUser = async (userData) => {
  try {
    const response = await api.post(`${API_BASE}/register`, userData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      throw new Error('User already exist');
    }
    // console.error('Registration failed:', error);
    throw error;
  }
};

export const loginUser = async ({username, password}) => {
  try {
    const response = await api.post(`${API_BASE}/login`, {username, password});
    return response.data;
  } catch (error) {
    // console.error('Login failed:', error);
    if (error.response && error.response.status === 403) {
      throw new Error('User does not exist');
    }
    throw error;
  }
};

export const logout = async () => {
  const response = await api.post(`${API_BASE}/logout`);
  return response.data;
};

export const deleteUser = async (uid) => {
  const response = await api.delete(`${API_BASE}/${uid}`);
  return response.data;
};

export const updateUser = async (uid, userData) => {
  try {
    const response = await api.put(`${API_BASE}/${uid}`, userData);
    return response.data;
  } catch (error) {
    console.error('Update failed:', error);
    throw error;
  }
};
