import React from 'react';
import {
  Badge,
  Content,
  ContextualHelp,
  Flex,
  Heading,
  StatusLight,
  Text,
} from '@adobe/react-spectrum';

import { AUDIT_TYPES } from '../../utils/utils';

export const isAllAuditsDisabled = (site) => site.auditConfig && site.auditConfig.auditsDisabled;
export const isSomeAuditsDisabled = (site) => site.auditConfig && Object.keys(site.auditConfig.auditTypeConfigs).some(type => site.auditConfig.auditTypeConfigs[type].disabled);

const AuditConfigStatus = ({site}) => {
  const auditsDisabled = isAllAuditsDisabled(site);
  const someAuditsDisabled = isSomeAuditsDisabled(site);
  const auditTypeConfigs = site.auditConfig.auditTypeConfigs;
  const label = auditsDisabled ? 'All Audits Disabled' : someAuditsDisabled ? 'Some Audits Disabled' : 'Audits Enabled';
  const variant = auditsDisabled ? 'negative' : someAuditsDisabled ? 'yellow' : 'positive';

  return (
    <Flex alignItems="center">
      <StatusLight
        aria-label={label}
        role="img"
        variant={variant}
      ></StatusLight>
      {someAuditsDisabled && (
        <ContextualHelp variant="info">
          <Heading>Audit Configuration</Heading>
          <Content>
            <Flex direction="column" gap="size-100">
              <Flex direction="row" gap="size-200">
                <Text>All Audits</Text>
                <Badge
                  variant={auditsDisabled ? 'negative' : 'positive'}
                >
                  {auditsDisabled ? 'Disabled' : 'Enabled'}
                </Badge>
              </Flex>
              <Heading level={3}>Audit Types</Heading>
              {AUDIT_TYPES.map((key) => (
                <Flex direction="row" gap="size-200" key={key}>
                  <Text>{key}</Text>
                  <Badge
                    variant={auditTypeConfigs[key]?.disabled ? 'negative' : 'positive'}
                  >
                    {auditTypeConfigs[key]?.disabled ? 'Disabled' : 'Enabled'}
                  </Badge>
                </Flex>
              ))}
            </Flex>
          </Content>
        </ContextualHelp>
      )}
    </Flex>
  );
};

export default AuditConfigStatus;
