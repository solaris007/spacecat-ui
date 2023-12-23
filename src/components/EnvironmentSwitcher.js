import {
  Badge,
  Button,
  Flex,
  Text,
} from '@adobe/react-spectrum';
import React from 'react';

import { setLocalStorageItem } from '../utils/localStorageUtil';

const EnvironmentSwitcher = ({ currentEnvironment }) => {

  const switchEnvironment = () => {
    const newEnvironment = currentEnvironment === 'development' ? 'production' : 'development';
    setLocalStorageItem('environment', newEnvironment);
    window.location.reload();
  };

  return (
    <Flex direction="row" justifyContent="space-between" alignItems="center" padding="size-200">
      <Flex gap="size-200">
        <Text>Current Environment:</Text>
        <Badge variant={currentEnvironment === 'development' ? 'positive' : 'negative'}>
          {currentEnvironment}
        </Badge>
        <Button variant="accent" onPress={switchEnvironment}>
          Switch to {currentEnvironment === 'development' ? 'Production' : 'Development'} Environment
        </Button>
      </Flex>
    </Flex>
  );
};

export default EnvironmentSwitcher;
