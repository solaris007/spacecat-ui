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

export const createOrganization = (organizationData) => fetchApi('organizations', {
  method: 'POST',
  body: JSON.stringify(organizationData),
});

export const getOrganization = (organizationId) => fetchApi(`organizations/${organizationId}`);

export const getOrganizations = () => fetchApi('organizations');

export const getSitesForOrganization = (organizationId) => fetchApi(`organizations/${organizationId}/sites`);

export const updateOrganization = (organizationId, organizationData) => fetchApi(`organizations/${organizationId}`, {
  method: 'PATCH',
  body: JSON.stringify(organizationData),
});

export const deleteOrganization = (organizationId) => fetchApi(`organizations/${organizationId}`, {
  method: 'DELETE',
});

export const getSites = () => fetchApi('sites');

export const getSitesWithLatestAudits = (auditType = 'lhs-mobile') => fetchApi(`sites/with-latest-audit/${auditType}`);

export const getAuditsOfTypeForSite = (siteId, auditType) => fetchApi(`sites/${siteId}/audits/${auditType}?ascending=false`);

export const getAuditForSite = (siteId, auditType, auditedAt) => fetchApi(`sites/${siteId}/audits/${auditType}/${auditedAt}`);

export const createSite = (siteData) => fetchApi('sites', {
  method: 'POST',
  body: JSON.stringify(siteData),
});

export const updateSite = (siteId, siteData) => fetchApi(`sites/${siteId}`, {
  method: 'PATCH',
  body: JSON.stringify(siteData),
});

export const toggleLiveStatus = (site) => {
  const updatedSite = { ...site, isLive: !site.isLive };
  return updateSite(site.id, { isLive: updatedSite.isLive });
};

export const toggleAllAuditsEnabled = (site) => {
  const updatedSite = {
    ...site,
    auditConfig: {
      ...site.auditConfig,
      auditsDisabled: !site.auditConfig.auditsDisabled
    }
  };
  return updateSite(site.id, { auditConfig: updatedSite.auditConfig });
};

export const toggleAuditTypeEnabled = (site, auditType) => {
  const updatedSite = {
    ...site,
    auditConfig: {
      ...site.auditConfig,
      auditTypeConfigs: {
        ...site.auditConfig.auditTypeConfigs,
        [auditType]: {
          ...site.auditConfig.auditTypeConfigs[auditType],
          disabled: !site.auditConfig.auditTypeConfigs[auditType].disabled
        }
      }
    }
  };
  return updateSite(site.id, { auditConfig: updatedSite.auditConfig });
}

export const deleteSite = (siteId) => fetchApi(`sites/${siteId}`, {
  method: 'DELETE',
});

export const getSite = (siteId) => fetchApi(`sites/${siteId}`);
