// components/EnvironmentSwitcher.js
import React from 'react';
import { setLocalStorageItem } from '../utils/localStorageUtil';
import { Button, Flex } from '@adobe/react-spectrum';
import { useNavigate } from 'react-router-dom';

const EnvironmentSwitcher = ({ currentEnvironment }) => {
  const navigate = useNavigate();

  const switchEnvironment = () => {
    const newEnvironment = currentEnvironment === 'development' ? 'production' : 'development';
    setLocalStorageItem('environment', newEnvironment);
    navigate('/');
  };

  return (
    <Flex direction="row" justifyContent="space-between" alignItems="center" padding="size-200">
      <Flex gap="size-200">
        {currentEnvironment}
        <Button variant="primary" onPress={switchEnvironment}>
          Switch to {currentEnvironment === 'development' ? 'Production' : 'Development'} Environment
        </Button>
        </Flex>
    </Flex>
  );
};

export default EnvironmentSwitcher;
