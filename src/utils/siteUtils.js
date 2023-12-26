import { createPSIDiffURL, createPSIReportURL } from './utils';
import { ToastQueue } from '@react-spectrum/toast';
import { toggleAllAuditsEnabled, toggleAuditTypeEnabled, toggleLiveStatus } from '../service/apiService';
import { isAllAuditsDisabled, isSomeAuditsDisabled } from '../components/content/AuditConfigStatus';
import { isValidUrl } from '@adobe/spacecat-shared-utils';

export function hasAudits(site) {
  return Array.isArray(site.audits) && site.audits.length > 0;
}

export function hasLiveStatus(site, liveStatus) {
  if (liveStatus === 'all') {
    return true;
  }
  if (liveStatus === 'live') {
    return site.isLive;
  }
  if (liveStatus === 'non-live') {
    return !site.isLive;
  }
}

export function hasAuditEnabledStatus(site, auditEnabledStatus) {
  if (auditEnabledStatus === 'all') {
    return true;
  }
  if (auditEnabledStatus === 'enabled') {
    return !isAllAuditsDisabled(site) && !isSomeAuditsDisabled(site);
  }
  if (auditEnabledStatus === 'disabled') {
    return isAllAuditsDisabled(site);
  }
  if (auditEnabledStatus === 'some') {
    return isSomeAuditsDisabled(site);
  }
}

export function isValidGitHubURL(value) {
  return isValidUrl(value) && value.startsWith('https://github.com/')
}

export function hasGitHubURLStatus(site, gitHubURLStatus) {
  if (gitHubURLStatus === 'all') {
    return true;
  }
  if (gitHubURLStatus === 'with') {
    return isValidGitHubURL(site.gitHubURL);
  }
  if (gitHubURLStatus === 'without') {
    return !isValidGitHubURL(site.gitHubURL);
  }
}

export function isAuditDisabled(site, strategy) {
  return isAllAuditsDisabled(site)
    || (site.auditConfig && site.auditConfig.auditTypeConfigs[strategy]?.disabled);
}

export function createActionHandler({
                                      site,
                                      audits,
                                      auditType,
                                      navigate,
                                      updateSites,
                                      setIsAuditDetailsDialogOpen,
                                    }) {
  return async (action) => {
    switch (action) {
      case 'open-site':
        navigate(`/sites/${site.id}`);
        break;
      case 'visit-site':
        window.open(
          site.baseURL,
          '_blank',
        );
        break;
      case 'visit-github':
        window.open(
          site.gitHubURL,
          '_blank',
        );
        break;
      case 'psi-report':
        window.open(
          createPSIReportURL(audits[0].fullAuditRef),
          '_blank',
        );
        break;
      case 'psi-diff':
        const sortedAudits = audits.sort((a, b) => new Date(a.auditedAt) - new Date(b.auditedAt));
        window.open(
          createPSIDiffURL(sortedAudits[0].fullAuditRef, sortedAudits[1].fullAuditRef),
          '_blank',
        );
        break;
      case 'copy-site-id':
        await navigator.clipboard.writeText(site.id);
        ToastQueue.positive('Copied Site ID to clipboard', { timeout: 5000 });
        break;
      case 'toggle-live-status':
        const updatedLiveStatus = await toggleLiveStatus(site);
        updateSites(updatedLiveStatus);
        ToastQueue.positive(`Toggled Live Status to ${updatedLiveStatus.isLive ? 'Live' : 'Non-Live'}`, { timeout: 5000 });
        break;
      case 'audit-details':
        setIsAuditDetailsDialogOpen(true);
        break;
      case 'toggle-all-audits-enabled':
        const updatedAllAuditsEnabled = await toggleAllAuditsEnabled(site);
        updateSites(updatedAllAuditsEnabled);
        ToastQueue.positive(`Toggled All Audits to ${!isAllAuditsDisabled(updatedAllAuditsEnabled) ? 'Enabled' : 'Disabled'}`, { timeout: 5000 });
        break;
      case 'toggle-audit-type-enabled':
        const updatedAuditTypeEnabled = await toggleAuditTypeEnabled(site, auditType);
        updateSites(updatedAuditTypeEnabled);
        ToastQueue.positive(`Toggled ${auditType} to ${!isAuditDisabled(updatedAuditTypeEnabled, auditType) ? 'Enabled' : 'Disabled'}`, { timeout: 5000 });
        break;
      default:
        break;
    }
  }
}
