// components/Footer.js
import React from 'react';
import { Flex, Link, Text, Well } from '@adobe/react-spectrum';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Well>
      <Flex justifyContent="space-between" alignItems="center">
        <Text>SpaceCat Admin</Text>
        <Link
          target="_blank"
          variant="secondary"
          href="https://adobe.enterprise.slack.com/archives/C05B53SRX7V"
        >
          Support via Slack at #franklin-spacecat
        </Link>
        <Text>&copy; {currentYear} Adobe</Text>
      </Flex>
    </Well>
  );
};

export default Footer;
