const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const ENVIRONMENT = localStorage.getItem('environment');
const API_KEY = localStorage.getItem(`apiKey_${ENVIRONMENT}`);

const headers = {
  'Content-Type': 'application/json',
  'x-api-key': `${API_KEY}`,
};

export const getSites = async () => {
  try {
    const response = await fetch(`${BASE_URL}/sites`, { headers });
    if (!response.ok) throw new Error('Network response was not ok.');
    return await response.json();
  } catch (error) {
    console.error('Error fetching sites:', error);
    throw error;
  }
};

export const getSite = async (siteId) => {
  try {
    const response = await fetch(`${BASE_URL}/sites/${siteId}`, { headers });
    if (!response.ok) throw new Error('Network response was not ok.');
    return await response.json();
  } catch (error) {
    console.error(`Error fetching site ${siteId}:`, error);
    throw error;
  }
};
