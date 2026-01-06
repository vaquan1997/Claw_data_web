import axios from 'axios';

const API_URL = 'https://api.example.com/data'; // Replace with the actual API endpoint

export const fetchData = async (page: number, limit: number) => {
  try {
    const response = await axios.get(`${API_URL}?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
