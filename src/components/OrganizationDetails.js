import {
  ActionButton,
  Flex,
  Grid,
  Heading,
  ProgressCircle,
  Text,
  View,
} from '@adobe/react-spectrum';
import { ToastQueue } from '@react-spectrum/toast';
import Edit from '@spectrum-icons/workflow/Edit';
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';

import { getSitesForOrganization, getOrganization, updateOrganization } from '../service/apiService';
import { formatDate } from '../utils/utils';

import OrganizationFormDialog from './dialogs/OrganizationFormDialog';
import ElementWithCopyAction from './content/ElementWithCopyAction';
import AuthContext from '../auth/AuthContext';
import SitesTable from './tables/SitesTable';


const OrganizationDetails = () => {
  const { isAuthenticated } = useContext(AuthContext);

  const { organizationId } = useParams();
  const [sites, setSites] = useState(null);
  const [isSitesLoading, setIsSitesLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isOrganizationEditDialogOpen, setIsOrganizationEditDialogOpen] = useState(false);
  const [organizationData, setOrganizationData] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    const fetchOrganizationData = async () => {
      try {
        const data = await getOrganization(organizationId);
        setOrganizationData(data);
      } catch (error) {
        console.error('Error fetching organization details:', error);
        ToastQueue.negative('Error fetching organization details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganizationData();
  }, [organizationId, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    const fetchSites = async () => {
      setIsSitesLoading(true);
      try {
        const sitesData = await getSitesForOrganization(organizationId);
        setSites(sitesData);
      } catch (error) {
        console.error('Error fetching sites:', error);
        ToastQueue.negative('Error fetching sites');
      } finally {
        setIsSitesLoading(false);
      }
    };

    fetchSites();
  }, [organizationId, isAuthenticated]);

  const onEditOrganization = () => {
    setIsOrganizationEditDialogOpen(true);
  };

  const handleEditOrganization = async (organizationData) => {
    await updateOrganization(organizationId, organizationData);
    setIsOrganizationEditDialogOpen(false);
    setOrganizationData(organizationData);
    ToastQueue.positive('Organization updated successfully', { timeout: 5000 });
  }

  if (isLoading) {
    return (
      <Flex alignItems="center" justifyContent="center" height="100%">
        <ProgressCircle aria-label="Loading…" isIndeterminate/>
      </Flex>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Grid
      areas={{
        base: [
          'header',
          'info',
          'sites',
        ],
        M: [
          'header header',
          'info sites',
        ],
      }}
      columns={{
        base: ['1fr'],
        M: ['1fr', '3fr'],
      }}
      rows={['auto', 'auto', 'auto']}
      gap="size-200"
    >
      <View gridArea="header">
        <Heading level={1}>Organization Details for {organizationData.name}</Heading>
        <Flex direction="row" alignSelf="start" gap="size-150">
          <ActionButton
            aria-label="Edit Organization"
            alignSelf="start"
            onPress={onEditOrganization}
          >
            <Edit size="S"/>
            <Text>Edit Organization</Text>
          </ActionButton>
        </Flex>
      </View>
      <View gridArea="info"
            borderWidth="thin"
            borderColor="dark"
            borderRadius="medium"
            padding="size-250"
      >
        <Flex direction="column" gap="size-150">
          <Text><strong>ID</strong></Text>
          <ElementWithCopyAction element={organizationData.id} value={organizationData.id}/>
          <Text><strong>Name</strong></Text>
          <Text>{organizationData.name}</Text>
          <Text><strong>IMS Org ID&nbsp;</strong></Text>
          <Text>{organizationData.imsOrgId}</Text>
          <Flex direction="row" justifyContent="space-between">
            <Flex direction="row" alignItems="start" gap="size-200">
              <Text><strong>Updated</strong></Text>
              <Text>{formatDate(organizationData.updatedAt)}</Text>
            </Flex>
            <Flex direction="row" alignItems="start" gap="size-200">
              <Text><strong>Created</strong></Text>
              <Text>{formatDate(organizationData.createdAt)}</Text>
            </Flex>
          </Flex>
        </Flex>
      </View>
      <View gridArea="sites">
        <View borderWidth="thin" borderColor="dark" borderRadius="medium" padding="size-250">
          <Flex direction="column" gap="size-100">
            {isSitesLoading ? (
              <ProgressCircle aria-label="Loading Sites…" isIndeterminate/>
            ) : (
              <SitesTable sites={sites}/>
            )}
          </Flex>
        </View>
      </View>
      <OrganizationFormDialog
        isOpen={isOrganizationEditDialogOpen}
        onClose={() => {
          setIsOrganizationEditDialogOpen(false);
        }}
        onSubmit={handleEditOrganization}
        organizationData={organizationData}
      />
    </Grid>
  );
};

export default OrganizationDetails;
