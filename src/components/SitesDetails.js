import {
  ActionButton, Divider,
  Flex,
  Grid,
  Heading,
  ProgressCircle,
  Text,
  View,
} from '@adobe/react-spectrum';
import { ToastQueue } from '@react-spectrum/toast';
import Edit from '@spectrum-icons/workflow/Edit';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { getSite, updateSite } from '../service/apiService';
import { formatDate, renderExternalLink } from '../utils/utils';

import LiveStatus from './LiveStatus';
import AuditConfigStatus from './AuditConfigStatus';
import SiteFormDialog from './SiteFormDialog';

const SiteDetails = () => {
  const { siteId } = useParams();
  const [siteData, setSiteData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSiteEditDialogOpen, setIsSiteEditDialogOpen] = useState(false);

  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        const data = await getSite(siteId);
        setSiteData(data);
      } catch (error) {
        console.error('Error fetching site details:', error);
        ToastQueue.negative('Error fetching site details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSiteData();
  }, [siteId]);

  const onEditSite = () => {
    setIsSiteEditDialogOpen(true);
  };

  const handleEditSite = async (siteData) => {
    await updateSite(siteId, siteData);
    setIsSiteEditDialogOpen(false);
    setSiteData(siteData);
    ToastQueue.positive('Site updated successfully', { timeout: 5000 });
  }

  if (isLoading) {
    return (
      <Flex alignItems="center" justifyContent="center" height="100%">
        <ProgressCircle aria-label="Loading…" isIndeterminate/>
      </Flex>
    );
  }

  return (
    <Grid
      areas={{
        base: [
        'header',
        'info',
        'audits',
        ],
        M: [
          'header header',
          'info audits',
        ],
      }}
      columns={{
        base: ['1fr'],
        M: ['1fr', '1fr'],
      }}
      rows={['auto', 'auto']}
      gap="size-200"
    >
      <View gridArea="header">
        <Heading level={1}>Site Details for {siteData.baseURL}</Heading>
        <Flex direction="row" alignSelf="start" gap="size-150">
          <ActionButton
            aria-label="Edit Site"
            alignSelf="start"
            onPress={onEditSite}
          >
            <Edit size="S"/>
            <Text>Edit Site</Text>
          </ActionButton>
        </Flex>
      </View>
      <View gridArea="info"
            borderWidth="thin"
            borderColor="dark"
            borderRadius="medium"
            padding="size-250"
      >
        <Flex direction="column" gap="size-100">
          <Text>Site Information</Text>
          <Divider size="S"/>
          <Text>
            <strong>Base URL:&nbsp;</strong>
            {renderExternalLink(siteData.baseURL)}
          </Text>
          <Text>
            <strong>GitHub URL:&nbsp;</strong>
            {renderExternalLink(siteData.gitHubURL)}
          </Text>
          <Text><strong>Created At:</strong> {formatDate(siteData.createdAt)}</Text>
          <Text><strong>Updated At:</strong> {formatDate(siteData.updatedAt)}</Text>
          <Flex direction="row" alignItems="center">
            <Text><strong>Live:</strong></Text>
            <LiveStatus item={siteData}/>
          </Flex>
          <Flex direction="row" alignItems="center">
            <Text><strong>Audits:</strong></Text>
            <AuditConfigStatus site={siteData}/>
          </Flex>
        </Flex>
      </View>
      <View gridArea="audits">
        <View
          borderWidth="thin"
          borderColor="dark"
          borderRadius="medium"
          padding="size-250"
        >
          <Flex direction="column" gap="size-100">
            <Text>Audits</Text>
            <Divider size="S"/>
            <Text>Coming soon...</Text>
          </Flex>
        </View>
      </View>
      <SiteFormDialog
        isOpen={isSiteEditDialogOpen}
        onClose={() => {
          setIsSiteEditDialogOpen(false);
        }}
        onSubmit={handleEditSite}
        siteData={siteData}
      />
    </Grid>
  );
};

export default SiteDetails;
