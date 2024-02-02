import {
  ActionMenu,
  Item,
  Text,
} from '@adobe/react-spectrum';
import Search from '@spectrum-icons/workflow/Search';
import { useNavigate } from 'react-router-dom';

import { createActionHandler } from '../../../utils/organizationUtils';
import Copy from '@spectrum-icons/workflow/Copy';
import { Section } from 'react-stately';

function OrganizationRowActions({ organization, updateOrganizations }) {
  const navigate = useNavigate();

  const handleAction = createActionHandler({
    organization,
    navigate,
    updateOrganizations,
  });

  const disabledKeys = [];

  return (
    <>
      <ActionMenu onAction={handleAction} isQuiet disabledKeys={disabledKeys}>
        <Section title="Organization">
          <Item key="open-organization" textValue="open organization"><Search size="S"/><Text>Organization Details</Text></Item>
          <Item key="copy-organization-id" textValue="copy organization id"><Copy size="S"/><Text>Copy Organization ID</Text></Item>
        </Section>
      </ActionMenu>
    </>
  );
}

export default OrganizationRowActions;
