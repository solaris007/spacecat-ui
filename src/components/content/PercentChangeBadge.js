import { formatPercent } from '../../utils/utils';
import { Badge } from '@adobe/react-spectrum';
import React from 'react';

const getBadgeVariant = (percentage, reverse) => {
  if (percentage > 0 || reverse) {
    return 'positive';
  } else if (percentage === 0) {
    return 'yellow';
  } else {
    return 'negative';
  }
};

function PercentChangeBadge({ percentage, label, size, reverse = false }) {
  const style = size === 'L' ? { fontWeight: 'bold', fontSize: '2em' } : {};
  const width = size === 'L' ? '' : 'size-700';
  const strLabel = size === 'L' ? `${label}: ` : '';
  const sign = percentage > 0 ? '+' : '';

  return (
    <Badge
      width={width}
      aria-label={label}
      variant={getBadgeVariant(percentage, reverse)}
      UNSAFE_style={style}
    >
      {strLabel}{sign}{formatPercent(percentage, 1)}
    </Badge>
  );
}

export default PercentChangeBadge;
