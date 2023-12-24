import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ProgressCircle, View, Text, Flex, Content } from '@adobe/react-spectrum';
import { getSite } from '../service/apiService';

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
        <ProgressCircle aria-label="Loading…" isIndeterminate />
      </Flex>
    );
  }

  return (
    <Content>
      <h1>Site Details</h1>
      <View>
        <Text><strong>Base URL:</strong> {siteData.baseURL}</Text>
        <Text><strong>GitHub URL:</strong> {siteData.gitHubURL}</Text>
        <Text><strong>Created At:</strong> {siteData.createdAt}</Text>
        <Text><strong>Updated At:</strong> {siteData.updatedAt}</Text>
      </View>
    </Content>
  );
};

export default SiteDetails;
