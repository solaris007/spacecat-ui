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

function AuditLHSScoreBadge({ score, label, size }) {
  const style = size === 'L' ? { fontWeight: 'bold', fontSize: '2em' } : {};
  const width = size === 'L' ? '' : 'size-600';
  const strLabel = size === 'L' ? `${label}: ` : '';
  return (
    <Badge
      width={width}
      aria-label={label}
      variant={getScoreVariant(score)}
      UNSAFE_style={style}
    >
      {strLabel}{formatPercent(score)}
    </Badge>
  );
}

export default AuditLHSScoreBadge;
