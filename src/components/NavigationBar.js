import { Divider, Flex, Image, Link, View } from '@adobe/react-spectrum';
import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import EnvironmentSwitcher from './EnvironmentSwitcher';

import AuthContext from '../auth/AuthContext';

const NavigationBar = () => {
  const { environment } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname;
  const basePath = process.env.PUBLIC_URL;

  const getLinkClassName = (path) => {
    return currentPath === path || (path !== `${basePath}/` && currentPath.startsWith(path)) ? 'active nav-link' : 'nav-link';
  };

  const handleNavigate = (path) => {
    navigate(path);
  }

  return (
    <Flex direction="column" gap="size-200">
      <Flex direction="row" justifyContent="space-between" alignItems="center" padding="size-200">
        <Flex gap="size-200" alignItems="center">
          <Link onPress={() => handleNavigate('/')} href="#">
            <Image src={`${process.env.PUBLIC_URL}/spacecat_logo_50.webp`} alt="SpaceCat Logo" width="50px"/>
          </Link>
          <Divider size="S" orientation="vertical"/>
          <Link UNSAFE_className={getLinkClassName(`${basePath}/`)} onPress={() => handleNavigate('/')} href="#">Dashboard</Link>
          <Divider size="S" orientation="vertical"/>
          <Link UNSAFE_className={getLinkClassName(`${basePath}/organizations`)} onPress={() => handleNavigate('/organizations')} href="#">Organizations</Link>
          <Divider size="S" orientation="vertical"/>
          <Link UNSAFE_className={getLinkClassName(`${basePath}/sites`)} onPress={() => handleNavigate('/sites')} href="#">Sites</Link>
          <Divider size="S" orientation="vertical"/>
          <Link UNSAFE_className={getLinkClassName(`${basePath}/audits`)} onPress={() => handleNavigate('/audits')} href="#">Audits</Link>
          <Divider size="S" orientation="vertical"/>
        </Flex>
        <View>
          <EnvironmentSwitcher currentEnvironment={environment}/>
        </View>
      </Flex>
      <Divider size="M"/>
    </Flex>
  );
};

export default NavigationBar;
