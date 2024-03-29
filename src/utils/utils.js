import React, { useEffect, useState } from 'react';
import { ToastQueue } from '@react-spectrum/toast';
import { Content, Heading, IllustratedMessage, Link } from '@adobe/react-spectrum';
import { isValidUrl } from '@adobe/spacecat-shared-utils';

export const AUDIT_TYPES = ['apex', 'broken-backlinks', '404', 'cwv', 'lhs-desktop', 'lhs-mobile'];
const PSI_ERROR_MAP = {
  ERRORED_DOCUMENT_REQUEST: {
    messageFormat: 'Could not fetch the page (Status: {statusCode})',
    pattern: /\(Status code: (\d+)\)/,
  },
  FAILED_DOCUMENT_REQUEST: {
    messageFormat: 'Failed to load the page (Details: {details})',
    pattern: /\(Details: (.+)\)/,
  },
  DNS_FAILURE: {
    messageFormat: 'DNS lookup failed',
    pattern: null,
  },
  NO_FCP: {
    messageFormat: 'No First Contentful Paint',
    pattern: null,
  },
};

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

export const renderExternalLink = (url, text = url) => {
  if (!isValidUrl(url)) {
    return '';
  }

  return (
    <Link target="_blank" rel="noopener noreferrer" href={url}>
      {text}
    </Link>
  );
}

export const createActionBarItems = (items, selectedKeys) => items.filter(item => {
  const minSelectionCondition = item.minSelections === undefined || selectedKeys.size >= item.minSelections;
  const maxSelectionCondition = item.maxSelections === undefined || selectedKeys.size <= item.maxSelections;
  return minSelectionCondition && maxSelectionCondition;
});


export const formatMs = (value, includeUnit = false) => {
  return `${Math.round(value)}${includeUnit ? ' ms' : ''}`;
}

export const formatSeconds = (value, includeUnit = false) => {
  if (Number.isNaN(value)) return '';
  return `${(value/1000).toFixed(2)}${includeUnit ? ' s' : ''}`;
}

export const formatBytes = (value, includeUnit = false) => {
  return `${Math.round(value / 1024)}${includeUnit ? ' KB' : ''}`;
}

export const formatPercent = (value, factor = 100) => {
  return `${Math.round(value * factor)}%`;
};

export const formatSigned = (number, precision = 0) => {
  if (number === 0) {
    return '±0';
  } else if (number > 0) {
    return `+${number.toFixed(precision)}`;
  } else {
    return number.toFixed(precision);
  }
}

export const formatLighthouseError = (runtimeError) => {
  const { code, message } = runtimeError;
  const errorConfig = PSI_ERROR_MAP[code] || { messageFormat: 'Unknown error', pattern: null };
  let description = errorConfig.messageFormat;

  if (errorConfig.pattern) {
    const match = message.match(errorConfig.pattern);
    if (match) {
      const placeholders = [...match].slice(1);
      placeholders.forEach((value) => {
        description = description.replace(/\{[^}]+\}/i, value);
      });
    } else {
      description = description.replace(/\{[^}]+\}/g, 'unknown');
    }
  }

  return `${description} [${code}]`;
};

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

export const createPSIReportURL = (fullAuditRef) => {
  return `https://googlechrome.github.io/lighthouse/viewer/?jsonurl=${fullAuditRef}`;
}

export const createPSIDiffURL = (fullAuditRefA, fullAuditRefB) => {
  return `https://adobe-rnd.github.io/lighthouse-diff-viewer/?baseReport=${fullAuditRefA}&compareReport=${fullAuditRefB}`;
}
