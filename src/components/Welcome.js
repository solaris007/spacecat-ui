import {
  Divider,
  Flex,
  Heading,
  Image,
  Item,
  Picker,
} from '@adobe/react-spectrum';
import React, { useState } from 'react';

import SpacecatDashboard from './dashboards/SpacecatDashboard';

const Welcome = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [auditType, setAuditType] = useState('lhs');
  const [loadingText, setLoadingText] = useState('Spacecat is loading...');
  const [dashboardTitle, setDashboardTitle] = useState('Performance Dashboard');

  const handleLoadingComplete = (loadingStatus) => {
    setIsLoading(loadingStatus);
  };

  const handleLoadingText = (text) => {
    setLoadingText(text);
  };

  const handleDashboardTitle = (text) => {
    setDashboardTitle(text);
  };

  return (
    <Flex direction="column" justifyContent="center" gap="size-200">
      <Flex direction="row" justifyContent="space-between" alignItems="center" gap="size-150">
        <Heading margin="0.2em" level={1}>{dashboardTitle}</Heading>
        <Picker
          label="Audit Type"
          labelPosition="side"
          selectedKey={auditType}
          onSelectionChange={setAuditType}
        >
          <Item key="lhs">Lighthouse Scores</Item>
          <Item key="404">404</Item>
        </Picker>
      </Flex>
      <Divider size="S"/>
      <SpacecatDashboard
        auditType={auditType}
        onLoadingComplete={handleLoadingComplete}
        onLoadingText={handleLoadingText}
        onDashboardTitle={handleDashboardTitle}
      />
      {isLoading && (
        <Flex direction="column" alignItems="center" justifyContent="center" gap="size-200">
          <Heading level={1}>{loadingText}</Heading>
          <Image src={`${process.env.PUBLIC_URL}/spacecat_logo_512.webp`} alt="SpaceCat Logo" UNSAFE_className="flipping"/>
        </Flex>
      )}
    </Flex>
  );
};

export default Welcome;
