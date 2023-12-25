import LHSDashboard from './LHSDashboard';

function SpacecatDashboard({ auditType, onLoadingComplete }) {
  switch (auditType) {
    case 'lhs-desktop':
    case 'lhs-mobile':
      return <LHSDashboard auditType={auditType} onLoadingComplete={onLoadingComplete} />
    default:
      return null;
  }
}

export default SpacecatDashboard;
