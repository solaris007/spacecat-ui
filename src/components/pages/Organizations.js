import { Heading } from '@adobe/react-spectrum';
import React, { useContext } from 'react';

import AuthContext from '../../auth/AuthContext';

import OrganizationsList from '../OrganizationsList';

const Organizations = () => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div>
      <Heading level={1}>Organizations</Heading>
      <OrganizationsList />
    </div>
  );
};

export default Organizations;
