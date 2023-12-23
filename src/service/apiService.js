const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const ENVIRONMENT = localStorage.getItem('environment');
const API_KEY = localStorage.getItem(`apiKey_${ENVIRONMENT}`);

const headers = {
  'Content-Type': 'application/json',
  'x-api-key': `${API_KEY}`,
};

const fetchApi = async (url, options = {}) => {
  try {
    const response = await fetch(url, { headers, ...options });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return options.method === 'DELETE' ? true : await response.json();
  } catch (error) {
    console.error(`Error with API request to ${url}:`, error);
    throw error;
  }
};

export const getSites = () => fetchApi(`${BASE_URL}/sites`);

export const createSite = (siteData) => fetchApi(`${BASE_URL}/sites`, {
  method: 'POST',
  body: JSON.stringify(siteData),
});

export const updateSite = (siteId, siteData) => fetchApi(`${BASE_URL}/sites/${siteId}`, {
  method: 'PATCH',
  body: JSON.stringify(siteData),
});

export const deleteSite = (siteId) => fetchApi(`${BASE_URL}/sites/${siteId}`, {
  method: 'DELETE',
});

export const getSite = (siteId) => fetchApi(`${BASE_URL}/sites/${siteId}`);
