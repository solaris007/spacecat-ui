import React from 'react';
import { Flex, Text } from '@adobe/react-spectrum';

import { formatLighthouseError, formatSeconds } from '../../utils/utils';

import AuditLHSScoreBadge from './AuditLHSScoreBadge';
import AuditLHSTotalBlockingTimeBadge from './AuditLHSTotalBlockingTimeBadge';

const scoreNames = [
  { key: 'performance', label: 'Perf' },
  { key: 'seo', label: 'SEO' },
  { key: 'accessibility', label: 'A11Y' },
  { key: 'best-practices', label: 'BP' }
];

const AuditLHSScoreStatus = ({ audit, size = '' }) => {
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
          <AuditLHSScoreBadge key={key} score={scores[key]} label={label} size={size}/>
        ))}
      </Flex>
    );
  }
  return null;
};

export default AuditLHSScoreStatus;
