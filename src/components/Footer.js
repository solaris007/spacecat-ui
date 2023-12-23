// components/Footer.js
import React from 'react';
import { Flex, Text } from '@adobe/react-spectrum';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Flex justifyContent="center" alignItems="center" padding="size-200">
      <Text>&copy; {currentYear} Your Company Name</Text>
    </Flex>
  );
};

export default Footer;
