import {
  Cell,
  Column,
  Divider,
  Flex,
  Grid, Heading, Row, TableBody, TableHeader, TableView,
  Text,
  View,
} from '@adobe/react-spectrum';
import React from 'react';

import { createPSIReportURL, formatBytes, formatDate, formatMs, renderExternalLink } from '../../utils/utils';

import LiveStatus from './LiveStatus';
import ErrorStatus from './ErrorStatus';
import AuditErrorLHS from './AuditErrorLHS';
import AuditLHSScoreStatus from './AuditLHSScoreStatus';
import AuditLHSTotalBlockingTimeBadge from './AuditLHSTotalBlockingTimeBadge';

function AuditDetailsLHS({ audit }) {
  return (
    <Grid
      areas={{
        base: [
          'info',
          'tbt',
        ],
        M: [
          'info tbt',
        ],
      }}
      columns={{
        base: ['1fr'],
        M: ['1fr', '2fr'],
      }}
      rows={['auto', 'auto']}
      gap="size-200"
    >
      <View gridArea="info"
            borderWidth="thin"
            borderColor="dark"
            borderRadius="medium"
            padding="size-250"
      >
        <Flex direction="column" gap="size-150">
          <Text><strong>Type</strong></Text>
          <Text>{audit.auditType}</Text>
          <Text><strong>Audit URL</strong></Text>
          <Text>{renderExternalLink(audit.auditResult.finalUrl)}</Text>
          <Text><strong>Results</strong></Text>
          <Text>{renderExternalLink(createPSIReportURL(audit.fullAuditRef), 'View PSI Report')}</Text>
          <Text>{renderExternalLink(audit.fullAuditRef, 'Raw JSON Result')}</Text>
          <Flex direction="row" alignItems="center">
            <Flex direction="row" alignItems="center">
              <Text><strong>Live Status:</strong></Text>
              <LiveStatus item={audit}/>
            </Flex>
            <Flex direction="row" alignItems="center">
              <Text><strong>Audit Error:</strong></Text>
              <ErrorStatus item={audit}/>
            </Flex>
          </Flex>
          <Divider size="S"/>
          <Flex direction="row" alignItems="start" gap="size-200">
            <Text><strong>Audited (UTC)</strong></Text>
            <Text>{formatDate(audit.auditedAt)}</Text>
            <Text><strong>Expires</strong></Text>
            <Text>{formatDate(audit.expiresAt)}</Text>
          </Flex>
        </Flex>
      </View>
      <View gridArea="tbt"
            borderWidth="thin"
            borderColor="dark"
            borderRadius="medium"
            padding="size-250"
      >
        {audit.isError ? (
          <AuditErrorLHS audit={audit}/>
        ) : (
          <Flex direction="column" gap="size-150">
            <Heading level={3}>Scores</Heading>
            <AuditLHSScoreStatus audit={audit} size="L"/>
            <Heading level={3}>Total Blocking Time</Heading>
            <AuditLHSTotalBlockingTimeBadge
              totalBlockingTime={audit.auditResult.totalBlockingTime}
              label="Total Blocking Time"
              size="L"
            />
            <Heading level={3}>Third Parties</Heading>
            <TableView aria-label="Third Parties" height="size-3600">
              <TableHeader>
                <Column key="entity">Trojan Horse</Column>
                <Column key="blockingTime">Blocking Time (ms)</Column>
                <Column key="mainThreadTime">Main Thread Time (ms)</Column>
                <Column key="transferSize">Transfer Size (KB)</Column>
              </TableHeader>
              <TableBody>
                {audit.auditResult.thirdPartySummary.map((result, index) => (
                  <Row key={index}>
                    <Cell>{result.entity}</Cell>
                    <Cell>{formatMs(result.blockingTime)}</Cell>
                    <Cell>{formatMs(result.mainThreadTime)}</Cell>
                    <Cell>{formatBytes(result.transferSize)}</Cell>
                  </Row>
                ))}
              </TableBody>
            </TableView>
          </Flex>
        )}
      </View>
    </Grid>
  )
}

export default AuditDetailsLHS;
