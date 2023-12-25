import {
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
  const [auditType, setAuditType] = useState('lhs-mobile');

  const handleLoadingComplete = (loadingStatus) => {
    setIsLoading(loadingStatus);
  };
  return (
    <Flex direction="column" justifyContent="center" gap="size-200">
      <Flex direction="row" justifyContent="space-between" gap="size-150">
        <Heading alignSelf="start" level={1}>Performance Dashboard</Heading>
        <Picker alignSelf="end" label="Audit Type" selectedKey={auditType} onSelectionChange={setAuditType}>
          <Item key="lhs-desktop">LHS Desktop</Item>
          <Item key="lhs-mobile">LHS Mobile</Item>
        </Picker>
      </Flex>
      <SpacecatDashboard auditType={auditType} onLoadingComplete={handleLoadingComplete}/>
      {isLoading && (
        <Flex direction="column" alignItems="center" justifyContent="center" gap="size-200">
          <Heading level={1}>Spacecat is loading...</Heading>
          <Image src="/spacecat_logo_512.webp" alt="SpaceCat Logo" UNSAFE_className="flipping"/>
        </Flex>
      )}
    </Flex>
  );
};

export default Welcome;
