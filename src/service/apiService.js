const BASE_URL = 'https://spacecat.experiencecloud.live/api';
const ENVIRONMENT = localStorage.getItem('environment');
const API_KEY = localStorage.getItem(`apiKey_${ENVIRONMENT}`);

const headers = {
  'Content-Type': 'application/json',
  'x-api-key': `${API_KEY}`,
};

const getApiURL = (path) => {
  if (ENVIRONMENT === 'production') {
    return `${BASE_URL}/v1/${path}`;
  } else {
    return `${BASE_URL}/ci/${path}`;
  }
}

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

export const getSites = () => fetchApi(getApiURL('sites'));

export const getSitesWithLatestAudits = (auditType = 'lhs-mobile') => fetchApi(getApiURL(`sites/with-latest-audit/${auditType}`));

export const createSite = (siteData) => fetchApi(getApiURL('sites'), {
  method: 'POST',
  body: JSON.stringify(siteData),
});

export const updateSite = (siteId, siteData) => fetchApi(getApiURL(`sites/${siteId}`), {
  method: 'PATCH',
  body: JSON.stringify(siteData),
});

export const deleteSite = (siteId) => fetchApi(getApiURL(`sites/${siteId}`), {
  method: 'DELETE',
});

export const getSite = (siteId) => fetchApi(getApiURL(`sites/${siteId}`));
