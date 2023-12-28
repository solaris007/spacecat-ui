import { Heading } from '@adobe/react-spectrum';
import React, { useContext } from 'react';

import AuthContext from '../../auth/AuthContext';

import SitesList from '../SitesList';

const Sites = () => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div>
      <Heading level={1}>Sites</Heading>
      <SitesList />
    </div>
  );
};

export default Sites;
