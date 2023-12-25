import React from 'react';
import { Flex, Text } from '@adobe/react-spectrum';

import { formatLighthouseError } from '../../utils/utils';

import AuditLHSScoreBadge from './AuditLHSScoreBadge';

const scoreNames = [
  { key: 'performance', label: 'Performance' },
  { key: 'seo', label: 'SEO' },
  { key: 'accessibility', label: 'Accessibility' },
  { key: 'best-practices', label: 'Best Practices' }
];

const AuditLHSScoreStatus = ({ audit }) => {
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
          <AuditLHSScoreBadge score={scores[key]} label={label}/>
        ))}
      </Flex>
    );
  }
  return null;
};

export default AuditLHSScoreStatus;
