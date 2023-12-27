import React, { useContext } from 'react';
import { Flex, Item, Picker } from '@adobe/react-spectrum';
import AuthContext from '../auth/AuthContext';

const EnvironmentSwitcher = () => {
  const { environment, switchEnvironment } = useContext(AuthContext);

  return (
    <Flex gap="size-200" alignItems="center">
      <Picker
        label="Environment"
        name="environment-picker"
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
