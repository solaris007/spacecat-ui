import React, { useEffect, useState } from 'react';
import { ToastQueue } from '@react-spectrum/toast';
import { Content, Heading, IllustratedMessage, Link } from '@adobe/react-spectrum';
import { isValidUrl } from '@adobe/spacecat-shared-utils';

export const AUDIT_TYPES = ['404', 'cwv', 'lhs-desktop', 'lhs-mobile'];

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    ToastQueue.positive('Value copied!', { timeout: 5000 })
  }).catch(err => {
    console.error('Could not copy text: ', err);
  });
};

export const renderEmptyState = () => {
  return (
    <IllustratedMessage>
      <Heading>No results</Heading>
      <Content>No results found</Content>
    </IllustratedMessage>
  );
}

export const renderExternalLink = (url) => {
  if (!isValidUrl(url)) {
    return '';
  }

  return (
    <Link target="_blank" rel="noopener noreferrer" href={url}>
      {url}
    </Link>
  );
}

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // getUTCMonth returns 0-11
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
