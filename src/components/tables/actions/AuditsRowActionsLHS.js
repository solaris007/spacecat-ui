import {
  ActionMenu,
  Item,
  Text,
} from '@adobe/react-spectrum';
import Search from '@spectrum-icons/workflow/Search';
import Globe from '@spectrum-icons/workflow/Globe';
import { useState } from 'react';
import AuditDetailsLHSDialog from '../../dialogs/AuditDetailsLHSDialog';
import { createPSIReportURL } from '../../../utils/utils';

function AuditsRowActionsLHS({ audit }) {
  const { fullAuditRef } = audit;
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);


  const handleAction = (action) => {
    switch (action) {
      case 'details':
        setIsDetailsDialogOpen(true);
        break;
      case 'psiReport':
        window.open(
          createPSIReportURL(fullAuditRef),
          '_blank',
        );
        break;
      default:
        break;
    }
  }

  return (
    <>
      <ActionMenu onAction={handleAction} isQuiet>
        <Item key="details" textValue="audit details"><Search size="S"/><Text>Audit Details</Text></Item>
        <Item key="psiReport" textValue="psi report"><Globe size="S"/><Text>View PSI Report</Text></Item>
      </ActionMenu>
      {isDetailsDialogOpen && (
        <AuditDetailsLHSDialog
          isOpen={isDetailsDialogOpen}
          onClose={() => setIsDetailsDialogOpen(false)}
          audit={audit}
        />
      )}
    </>
  );
}

export default AuditsRowActionsLHS;
