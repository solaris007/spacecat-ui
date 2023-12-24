import React from 'react';
import { Flex, Heading, Image } from '@adobe/react-spectrum';

const Welcome = () => {
  return (
    <Flex direction="column" alignItems="center" justifyContent="center" width="100wv" gap="size-200">
      <Heading level={1}>Welcome to SpaceCat Admin</Heading>
      <Image src="/spacecat_logo_512.webp" alt="SpaceCat Logo"/>
    </Flex>
  );
};

export default Welcome;
