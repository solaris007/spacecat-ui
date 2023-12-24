import React from 'react';
import { StatusLight } from '@adobe/react-spectrum';

const ErrorStatus = ({item}) => {
  const ieError = item?.ieError;
  return (
    <StatusLight
      aria-label={ieError ? 'OK' : 'Error'}
      role="img"
      variant={ieError ? 'negative' : 'positive'}
    ></StatusLight>
  );
};

export default ErrorStatus;
