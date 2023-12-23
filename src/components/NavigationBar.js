// components/NavigationBar.js
import React from 'react';
import EnvironmentSwitcher from './EnvironmentSwitcher';
import { Flex, Link, View } from '@adobe/react-spectrum';

const NavigationBar = ({ currentEnvironment }) => {
  return (
    <Flex direction="row" justifyContent="space-between" alignItems="center" padding="size-200">
      <Flex gap="size-200">
        <Link href="/">Home</Link>
        <Link href="/sites">Sites</Link>
        <Link href="/audits">Audits</Link>
      </Flex>
      <View>
        <EnvironmentSwitcher currentEnvironment={currentEnvironment} />
      </View>
    </Flex>
  );
};

export default NavigationBar;
