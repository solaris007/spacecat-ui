import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ProgressCircle, View, Text, Flex, Content, Heading, Link } from '@adobe/react-spectrum';
import { getSite } from '../service/apiService';
import { formatDate, renderExternalLink } from '../utils/utils';
import LiveStatus from './LiveStatus';
import AuditConfigStatus from './AuditConfigStatus';
import { isValidUrl } from '@adobe/spacecat-shared-utils';

const SiteDetails = () => {
  const { siteId } = useParams();
  const [siteData, setSiteData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        const data = await getSite(siteId);
        setSiteData(data);
      } catch (error) {
        console.error('Error fetching site details:', error);
        // Handle error appropriately
      } finally {
        setIsLoading(false);
      }
    };

    fetchSiteData();
  }, [siteId]);

  if (isLoading) {
    return (
      <Flex alignItems="center" justifyContent="center" height="100%">
        <ProgressCircle aria-label="Loading…" isIndeterminate/>
      </Flex>
    );
  }

  return (
    <Content>
      <Heading level={1}>Site Details for {siteData.baseURL}</Heading>
      <View
        borderWidth="thin"
        borderColor="dark"
        borderRadius="medium"
        padding="size-250">
        <Flex direction="column" gap="size-100">
          <Text>
            <strong>Base URL:&nbsp;</strong>
            {renderExternalLink(siteData.baseURL)}
          </Text>
          <Text>
            <strong>GitHub URL:&nbsp;</strong>
            {renderExternalLink(siteData.baseURL)}
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
    </Content>
  );
};

export default SiteDetails;
