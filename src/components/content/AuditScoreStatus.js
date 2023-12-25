import React from 'react';
import { Badge, Flex, Text } from '@adobe/react-spectrum';
import { formatLighthouseError, formatPercent } from '../../utils/utils';

const scoreNames = [
  { key: 'performance', label: 'Performance' },
  { key: 'seo', label: 'SEO' },
  { key: 'accessibility', label: 'Accessibility' },
  { key: 'best-practices', label: 'Best Practices' }
];

const getScoreVariant = (score) => {
  if (score >= 0.9) {
    return 'positive';
  } else if (score >= 0.5) {
    return 'yellow';
  } else {
    return 'negative';
  }
};

const AuditScoreStatus = ({ audit }) => {
  const auditType = audit?.auditType;
  const scores = audit?.auditResult?.scores;
  const isError = audit?.isError;

  if (auditType === 'lhs-desktop' || auditType === 'lhs-mobile') {
    if (isError) {
      return (
        <Flex direction="row" gap="size-100" alignItems="center">
          <Text>Error: {formatLighthouseError(audit.auditResult.runtimeError)}</Text>
        </Flex>
      );
    }
    return (
      <Flex direction="row" gap="size-100" alignItems="center">
        {scoreNames.map(({ key, label }) => (
          <Badge
            width="size-600"
            key={key}
            aria-label={label}
            variant={getScoreVariant(scores[key])}
          >
            {formatPercent(scores[key])}
          </Badge>
        ))}
      </Flex>
    );
  }
  return null;
};

export default AuditScoreStatus;
