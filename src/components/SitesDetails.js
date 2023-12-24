import React from 'react';
import { useParams } from 'react-router-dom';

const SiteDetails = () => {
  const { siteId } = useParams();
  return (
    <div>
      <h1>Site Details</h1>
      {siteId}
    </div>
  );
};

export default SiteDetails;
