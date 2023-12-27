import {
  ActionMenu,
  Item,
  Text,
} from '@adobe/react-spectrum';
import Search from '@spectrum-icons/workflow/Search';
import Globe from '@spectrum-icons/workflow/Globe';
import { useNavigate } from 'react-router-dom';

import { createActionHandler, isAuditDisabled } from '../../../utils/siteUtils';
import Copy from '@spectrum-icons/workflow/Copy';
import Play from '@spectrum-icons/workflow/Play';
import { useState } from 'react';
import AuditDetailsLHSDialog from '../../dialogs/AuditDetailsLHSDialog';
import { Section } from 'react-stately';
import { isAllAuditsDisabled } from '../../content/AuditConfigStatus';

function SiteRowActions({ site, auditType, audit, updateSites }) {
  const [isAuditDetailsDialogOpen, setIsAuditDetailsDialogOpen] = useState(false);
  const { gitHubURL } = site;

  const navigate = useNavigate();

  const handleAction = createActionHandler({
    site,
    audit,
    auditType,
    navigate,
    updateSites,
    setIsAuditDetailsDialogOpen,
  });

  const disabledKeys = [];

  if (!gitHubURL) {
    disabledKeys.push('visit-github');
  }

  if (!audit) {
    disabledKeys.push('audit-details');
    disabledKeys.push('psi-report');
  }

  if (!auditType) {
    disabledKeys.push('toggle-audit-type-enabled');
  }

  return (
    <>
      <ActionMenu onAction={handleAction} isQuiet disabledKeys={disabledKeys}>
        <Section title="Site">
          <Item key="open-site" textValue="open site"><Search size="S"/><Text>Site Details</Text></Item>
          <Item key="visit-site" textValue="visit site"><Globe size="S"/><Text>Go To Site</Text></Item>
          <Item key="visit-github" textValue="visit github"><Globe size="S"/><Text>Go To GitHub</Text></Item>
          <Item key="copy-site-id" textValue="copy site id"><Copy size="S"/><Text>Copy Site ID</Text></Item>
        </Section>
        <Section title="Audit">
          <Item key="audit-details" textValue="audit details"><Search size="S"/><Text>Audit Details (latest)</Text></Item>
          <Item key="psi-report" textValue="psi report"><Globe size="S"/><Text>PSI Report</Text></Item>
        </Section>
        <Section title="Actions">
          <Item key="toggle-live-status" textValue="toggle live status">
            <Play size="S"/><Text>Set Site to {site.isLive ? 'Non-Live' : 'Live'}</Text>
          </Item>
          <Item key="toggle-all-audits-enabled" textValue="toggle all audits enabled">
            <Play size="S"/><Text>Set All Audits {isAllAuditsDisabled(site) ? 'Enabled' : 'Disabled'}</Text>
          </Item>
          <Item key="toggle-audit-type-enabled" textValue="toggle audit type enabled">
            <Play size="S"/><Text>Set Audit Type {isAuditDisabled(site, auditType) ? 'Enabled' : 'Disabled'}</Text>
          </Item>
        </Section>
      </ActionMenu>
      {isAuditDetailsDialogOpen && (
        <AuditDetailsLHSDialog
          isOpen={isAuditDetailsDialogOpen}
          onClose={() => setIsAuditDetailsDialogOpen(false)}
          audit={audit}
        />
      )}
    </>
  );
}

export default SiteRowActions;
