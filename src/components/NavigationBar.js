import { Divider, Flex, Image, Link, View } from '@adobe/react-spectrum';
import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';

import EnvironmentSwitcher from './EnvironmentSwitcher';

import AuthContext from '../auth/AuthContext';

const NavigationBar = () => {
  const { environment } = useContext(AuthContext);
  const location = useLocation();
  const currentPath = location.pathname;

  const getLinkClassName = (path) => {
    return currentPath.startsWith(path) ? 'active nav-link' : 'nav-link';
  };

  return (
    <Flex direction="column" gap="size-200">
      <Flex direction="row" justifyContent="space-between" alignItems="center" padding="size-200">
        <Flex gap="size-200" alignItems="center">
          <Link href="/">
            <Image src="/spacecat_logo_50.webp" alt="SpaceCat Logo" width="50px"/>
          </Link>
          <Link UNSAFE_className={getLinkClassName('/sites')} href="/sites">Sites</Link>
          <Divider size="S" orientation="vertical"/>
          <Link UNSAFE_className={getLinkClassName('/audits')} href="/audits">Audits</Link>
          <Divider size="S" orientation="vertical"/>
        </Flex>
        <View>
          <EnvironmentSwitcher currentEnvironment={environment}/>
        </View>
      </Flex>
      <Divider size="S"/>
    </Flex>
  );
};

export default NavigationBar;
