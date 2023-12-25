import AuditsRowActionsLHS from './AuditsRowActionsLHS';

function AuditsRowActions({ audit, auditType }) {
  switch (auditType) {
    case 'lhs-desktop':
    case 'lhs-mobile':
      return <AuditsRowActionsLHS audit={audit} />
    default:
      return null;
  }
}

export default AuditsRowActions;
