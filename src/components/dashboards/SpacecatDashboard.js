import { Text } from '@adobe/react-spectrum';

import LHSDashboard from './LHSDashboard';

function SpacecatDashboard({
                             auditType,
                             onLoadingComplete,
                             onLoadingText,
                             onDashboardTitle,
                           }) {
  switch (auditType) {
    case 'lhs':
      return <LHSDashboard
        onLoadingComplete={onLoadingComplete}
        onLoadingText={onLoadingText}
        onDashboardTitle={onDashboardTitle}
      />
    default:
      onDashboardTitle('404 Report');
      return <Text>Coming Soon...</Text>;
  }
}

export default SpacecatDashboard;
