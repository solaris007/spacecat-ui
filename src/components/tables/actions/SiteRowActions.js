import {
  ActionMenu,
  Item,
  Text,
} from '@adobe/react-spectrum';
import Search from '@spectrum-icons/workflow/Search';
import Globe from '@spectrum-icons/workflow/Globe';
import { useNavigate } from 'react-router-dom';

import { createPSIReportURL } from '../../../utils/utils';


function SiteRowActions({ site }) {
  const { id, baseURL, gitHubURL } = site;

  const navigate = useNavigate();

  const handleAction = (action) => {
    switch (action) {
      case 'open':
        navigate(`/sites/${id}`);
        break;
      case 'visit-site':
        window.open(
          baseURL,
          '_blank',
        );
        break;
      case 'visit-github':
        window.open(
          gitHubURL,
          '_blank',
        );
        break;
      case 'psi-report':
        window.open(
          createPSIReportURL(site.audits[0].fullAuditRef),
          '_blank',
        );
        break;
      default:
        break;
    }
  }

  const disabledKeys = [];
  if (!gitHubURL) {
    disabledKeys.push('visit-github');
  }

  return (
    <>
      <ActionMenu onAction={handleAction} isQuiet disabledKeys={disabledKeys}>
        <Item key="open" textValue="open site"><Search size="S"/><Text>Site Details</Text></Item>
        <Item key="psi-report" textValue="psi report"><Globe size="S"/><Text>PSI Report</Text></Item>
        <Item key="visit-site" textValue="visit site"><Globe size="S"/><Text>Go To Site</Text></Item>
        <Item key="visit-github" textValue="visit github"><Globe size="S"/><Text>Go To GitHub</Text></Item>
      </ActionMenu>
    </>
  );
}

export default SiteRowActions;
