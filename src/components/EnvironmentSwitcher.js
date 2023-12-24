import React, { useContext } from 'react';
import { Badge, Button, Flex, Text } from '@adobe/react-spectrum';
import AuthContext from '../auth/AuthContext';

const EnvironmentSwitcher = () => {
  const { environment, switchEnvironment } = useContext(AuthContext);

  return (
    <Flex gap="size-200" alignItems="center">
      <Text>Current Environment:</Text>
      <Badge variant={environment === 'development' ? 'positive' : 'negative'}>
        {environment}
      </Badge>
      <Button variant="accent" onPress={switchEnvironment}>
        Switch to {environment === 'development' ? 'Production' : 'Development'} Environment
      </Button>
    </Flex>
  );
};

export default EnvironmentSwitcher;
