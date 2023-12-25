import React from 'react';
import SitesList from '../SitesList';
import { Heading } from '@adobe/react-spectrum';

const Sites = () => {
  return (
    <div>
      <Heading level={1}>Sites</Heading>
      <SitesList />
    </div>
  );
};

export default Sites;
