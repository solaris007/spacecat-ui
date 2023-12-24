import React, { useContext } from 'react';
import EnvironmentSwitcher from './EnvironmentSwitcher';
import { Divider, Flex, Image, Link, View } from '@adobe/react-spectrum';
import AuthContext from '../auth/AuthContext';

const NavigationBar = () => {
  const { environment } = useContext(AuthContext);

  return (
    <Flex direction="column" gap="size-200">
      <Flex direction="row" justifyContent="space-between" alignItems="center" padding="size-200">
        <Flex gap="size-200" alignItems="center">
          <Image src="/spacecat_logo_50.webp" alt="SpaceCat Logo" width="50px"/>
          <Link href="/">Home</Link>
          <Link href="/sites">Sites</Link>
          <Link href="/audits">Audits</Link>
        </Flex>
        <View>
          <EnvironmentSwitcher currentEnvironment={environment}/>
        </View>
      </Flex>
      <Divider size="S" />
    </Flex>
  );
};

export default NavigationBar;
