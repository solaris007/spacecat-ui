import React, { useContext } from 'react';

import AuthContext from '../../auth/AuthContext';

const Audits = () => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div>
      <h1>Audits Collection</h1>
      <p>Coming Soon ...</p>
    </div>
  );
};

export default Audits;
