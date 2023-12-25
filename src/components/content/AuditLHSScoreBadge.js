import { formatPercent } from '../../utils/utils';
import { Badge } from '@adobe/react-spectrum';
import React from 'react';

const getScoreVariant = (score) => {
  if (score >= 0.9) {
    return 'positive';
  } else if (score >= 0.5) {
    return 'yellow';
  } else {
    return 'negative';
  }
};

function AuditLHSScoreBadge({ score, label }) {
  return (
    <Badge
      width="size-600"
      aria-label={label}
      variant={getScoreVariant(score)}
    >
      {formatPercent(score)}
    </Badge>
  );
}

export default AuditLHSScoreBadge;
