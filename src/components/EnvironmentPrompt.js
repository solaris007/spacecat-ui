import React, { useEffect, useState } from 'react';
import { getLocalStorageItem, setLocalStorageItem } from '../utils/localStorageUtil';
import { Button, TextField, Picker, Item, Flex, Heading } from '@adobe/react-spectrum';

const EnvironmentPrompt = () => {
  const [apiKey, setApiKey] = useState('');
  const [environment, setEnvironment] = useState('');

  useEffect(() => {
    const storedEnvironment = getLocalStorageItem('environment');
    if (storedEnvironment) {
      setEnvironment(storedEnvironment);
      const storedApiKey = getLocalStorageItem(`apiKey_${storedEnvironment}`);
      if (storedApiKey) {
        setApiKey(storedApiKey);
      }
    }
  }, []);

  const handleSave = () => {
    setLocalStorageItem('environment', environment);
    setLocalStorageItem(`apiKey_${environment}`, apiKey);
    window.location.reload(); // Reload to apply changes
  };

  return (
    <Flex direction="column" gap="size-100" alignItems="center" padding="size-500">
      <Heading level={3}>Set Environment and API Key</Heading>

      <Picker
        label="Environment"
        width="size-2400"
        onSelectionChange={setEnvironment}
        selectedKey={environment}
      >
        <Item key="development">Development</Item>
        <Item key="production">Production</Item>
      </Picker>

      <TextField
        label="API Key"
        type="text"
        value={apiKey}
        onChange={setApiKey}
        width="size-2400"
      />

      <Button variant="cta" onPress={handleSave}>Save</Button>
    </Flex>
  );
};

export default EnvironmentPrompt;
