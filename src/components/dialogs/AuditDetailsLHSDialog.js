import {
  Button,
  ButtonGroup,
  Content,
  Dialog,
  DialogContainer,
  Divider,
  Flex,
  Heading,
  ProgressCircle,
} from '@adobe/react-spectrum';
import { ToastQueue } from '@react-spectrum/toast';
import React, { useEffect, useState } from 'react';

import { getAuditForSite } from '../../service/apiService';
import AuditDetailsLHS from '../content/AuditDetailsLHS';

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
        <Heading level={3}>Audit Details</Heading>
        <Divider/>
        <Content>
          <Flex direction="column" gap="size-150">
            {isLoading ? (
              <ProgressCircle aria-label="Loading…" isIndeterminate/>
            ) : (
              <AuditDetailsLHS audit={auditDetails}/>
            )}
            <Divider size="S"/>
            <ButtonGroup alignSelf="end">
              <Button variant="accent" onPress={onClose}>Close</Button>
            </ButtonGroup>
          </Flex>
        </Content>
      </Dialog>
    </DialogContainer>
  );
}

export default AuditDetailsLHSDialog;
