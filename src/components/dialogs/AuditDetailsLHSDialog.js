import {
  ActionButton,
  Content,
  Dialog,
  DialogContainer,
  Divider,
  Flex,
  Heading,
  ProgressCircle,
  Text,
} from '@adobe/react-spectrum';
import { ToastQueue } from '@react-spectrum/toast';
import React, { useEffect, useState } from 'react';

import { getAuditForSite } from '../../service/apiService';
import AuditDetailsLHS from '../content/AuditDetailsLHS';
import Close from '@spectrum-icons/workflow/Close';

function AuditDetailsLHSDialog({ isOpen, onClose, audit }) {
  const { auditedAt, auditType, siteId } = audit;
  const [auditDetails, setAuditDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAuditDetails = async () => {
      try {
        const result = await getAuditForSite(siteId, auditType, auditedAt);
        setAuditDetails(result);
      } catch (error) {
        console.error('Error fetching audit details:', error);
        ToastQueue.negative('Error fetching audit details');
      } finally {
        setIsLoading(false);
      }
    }
    if (isOpen) {
      setIsLoading(true);
      fetchAuditDetails();
    }
  }, [siteId, auditType, auditedAt, isOpen]);

  return (
    <DialogContainer
      onDismiss={onClose}
      type="fullscreen"
    >
      <Dialog
        isOpen={isOpen}
        onClose={onClose}
        aria-label="Audit Details"
      >
        <Heading>
          <Flex direction="row" alignItems="center" justifyContent="space-between" gap="size-200">
            <Text>Audit Details</Text>
            <ActionButton onPress={onClose} isQuiet><Close size="L"/></ActionButton>
          </Flex>
        </Heading>
        <Divider/>
        <Content>
          <Flex direction="column" gap="size-150">
            {isLoading ? (
              <ProgressCircle aria-label="Loading…" isIndeterminate/>
            ) : (
              <AuditDetailsLHS audit={auditDetails}/>
            )}
            <Divider size="S"/>
          </Flex>
        </Content>
      </Dialog>
    </DialogContainer>
  );
}

export default AuditDetailsLHSDialog;
