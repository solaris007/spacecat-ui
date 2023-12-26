import React, { useContext } from 'react';
import { Badge, Button, Flex, Item, Picker, Text } from '@adobe/react-spectrum';
import AuthContext from '../auth/AuthContext';

const EnvironmentSwitcher = () => {
  const { environment, switchEnvironment } = useContext(AuthContext);

  return (
    <Flex gap="size-200" alignItems="center">
      <Picker
        label="Environment"
        labelPosition="side"
        selectedKey={environment}
        onSelectionChange={switchEnvironment}
      >
        <Item key="development">Development</Item>
        <Item key="production">Production</Item>
      </Picker>
    </Flex>
  );
};

export default EnvironmentSwitcher;
