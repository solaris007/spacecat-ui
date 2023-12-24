const BASE_URL = 'https://spacecat.experiencecloud.live/api';

const createHeaders = (apiKey) => ({
  'Content-Type': 'application/json',
  'x-api-key': `${apiKey}`,
});

const getApiURL = (env, path) => {
  if (env === 'production') {
    return `${BASE_URL}/v1/${path}`;
  } else {
    return `${BASE_URL}/ci/${path}`;
  }
}

const fetchApi = async (url, options = {}) => {
  const env = localStorage.getItem('environment');
  const apiKey = localStorage.getItem(`apiKey_${env}`);
  const finalUrl = getApiURL(env, url);
  const headers = createHeaders(apiKey);
  try {
    const response = await fetch(finalUrl, { headers, ...options });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return options.method === 'DELETE' ? true : await response.json();
  } catch (error) {
    console.error(`Error with API request to ${url}:`, error);
    throw error;
  }
};

export const getSites = () => fetchApi('sites');

export const getSitesWithLatestAudits = (auditType = 'lhs-mobile') => fetchApi(`sites/with-latest-audit/${auditType}`);

export const getAuditsOfTypeForSite = (siteId, auditType) => fetchApi(`sites/${siteId}/audits/${auditType}?ascending=false`);

export const createSite = (siteData) => fetchApi('sites', {
  method: 'POST',
  body: JSON.stringify(siteData),
});

export const updateSite = (siteId, siteData) => fetchApi(`sites/${siteId}`, {
  method: 'PATCH',
  body: JSON.stringify(siteData),
});

export const deleteSite = (siteId) => fetchApi(`sites/${siteId}`, {
  method: 'DELETE',
});

export const getSite = (siteId) => fetchApi(`sites/${siteId}`);
