import { formatPercent, formatSeconds } from '../../utils/utils';
import { Badge } from '@adobe/react-spectrum';
import React from 'react';

const getBadgeVariant = (totalBlockingTime) => {
  if (totalBlockingTime <= 200) {
    return 'positive';
  } else if (totalBlockingTime <= 500) {
    return 'yellow';
  } else {
    return 'negative';
  }
};

function AuditLHSTotalBlockingTimeBadge({ totalBlockingTime, label, size }) {
  const style = size === 'L' ? { 'font-weight': 'bold', 'font-size': '2em' } : {};
  const width = size === 'L' ? '' : 'size-600';
  const strLabel = size === 'L' ? `${label}: ` : '';
  return (
    <Badge
      width={width}
      aria-label={label}
      variant={getBadgeVariant(totalBlockingTime)}
      UNSAFE_style={style}
    >
      {strLabel}{formatSeconds(totalBlockingTime)} s
    </Badge>
  );
}

export default AuditLHSTotalBlockingTimeBadge;
