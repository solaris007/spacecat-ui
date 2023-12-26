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

export function isAuditDisabled(site, strategy) {
  return (site.auditConfig && site.auditConfig.auditsDisabled)
    || (site.auditConfig && site.auditConfig.auditTypeConfigs[strategy]?.disabled);
}
