import { Badge, Flex, Heading, Well } from '@adobe/react-spectrum';
import React from 'react';

import ElementWithCopyAction from './ElementWithCopyAction';

function AuditErrorLHS({ audit }) {
  return (
    <Flex direction="column" gap="size-150">
      <Heading level={2}>This Audit Experienced An Error</Heading>
      <ElementWithCopyAction
        element={<Badge variant="negative">{audit.auditResult.runtimeError.code}</Badge>}
        value={audit.auditResult.runtimeError.code}
      />
      <Well>
        <ElementWithCopyAction
          element={audit.auditResult.runtimeError.message}
          value={audit.auditResult.runtimeError.message}
        />
      </Well>
    </Flex>
  );
};

export default AuditErrorLHS;
