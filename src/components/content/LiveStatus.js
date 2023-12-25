import React from 'react';
import { StatusLight } from '@adobe/react-spectrum';

const LiveStatus = ({item}) => {
  const isLive = item?.isLive;
  return (
    <StatusLight
      aria-label={isLive ? 'Live' : 'Not Live'}
      role="img"
      variant={isLive ? 'positive' : 'negative'}
    ></StatusLight>
  );
};

export default LiveStatus;
