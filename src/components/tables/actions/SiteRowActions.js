import {
  ActionMenu,
  Item,
  Text,
} from '@adobe/react-spectrum';
import Search from '@spectrum-icons/workflow/Search';
import Globe from '@spectrum-icons/workflow/Globe';
import { useNavigate } from 'react-router-dom';

import { createActionHandler } from '../../../utils/siteUtils';
import Copy from '@spectrum-icons/workflow/Copy';
import Play from '@spectrum-icons/workflow/Play';


function SiteRowActions({ site, updateSites }) {
  const { gitHubURL } = site;

  const navigate = useNavigate();

  const handleAction = createActionHandler({
    site,
    audit: site.audits[0],
    navigate,
    updateSites,
  });

  const disabledKeys = [];
  if (!gitHubURL) {
    disabledKeys.push('visit-github');
  }

  return (
    <>
      <ActionMenu onAction={handleAction} isQuiet disabledKeys={disabledKeys}>
        <Item key="open-site" textValue="open site"><Search size="S"/><Text>Site Details</Text></Item>
        <Item key="visit-site" textValue="visit site"><Globe size="S"/><Text>Go To Site</Text></Item>
        <Item key="toggle-live-status" textValue="toggle live status"><Play size="S"/><Text>Toggle Live Status</Text></Item>
        <Item key="copy-site-id" textValue="copy site id"><Copy size="S"/><Text>Copy Site ID</Text></Item>
        <Item key="psi-report" textValue="psi report"><Globe size="S"/><Text>PSI Report</Text></Item>
        <Item key="visit-github" textValue="visit github"><Globe size="S"/><Text>Go To GitHub</Text></Item>
      </ActionMenu>
    </>
  );
}

export default SiteRowActions;
