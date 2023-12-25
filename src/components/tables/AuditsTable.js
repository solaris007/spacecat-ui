import {
  Cell,
  Column,
  Row,
  TableBody,
  TableHeader,
  TableView,
} from '@adobe/react-spectrum';
import React from 'react';

import { formatDate, renderExternalLink } from '../../utils/utils';

import AuditScoreStatus from '../content/AuditScoreStatus';
import LiveStatus from '../content/LiveStatus';
import ErrorStatus from '../content/ErrorStatus';

import AuditsRowActions from './actions/AuditsRowActions';

function AuditsTable({ auditType, audits }) {
  return (
    <TableView aria-label="Audit List" height="size-3600">
      <TableHeader>
        <Column key="auditedAt" width="0.6fr">Audited At (UTC)</Column>
        <Column key="auditURL">Audit URL</Column>
        <Column key="scores">Scores</Column>
        <Column key="isLive" width="0.2fr">Live</Column>
        <Column key="isError" width="0.2fr">Error</Column>
        <Column key="actions" width="0.2fr">&nbsp;</Column>
      </TableHeader>
      <TableBody>
        {audits && audits.map((audit, index) => (
          <Row key={index}>
            <Cell>{formatDate(audit.auditedAt)}</Cell>
            <Cell>{renderExternalLink(audit.auditResult.finalUrl)}</Cell>
            <Cell><AuditScoreStatus audit={audit}/></Cell>
            <Cell><LiveStatus item={audit}/></Cell>
            <Cell><ErrorStatus item={audit}/></Cell>
            <Cell><AuditsRowActions audit={audit} auditType={auditType}/></Cell>
          </Row>
        ))}
      </TableBody>
    </TableView>
  )
}

export default AuditsTable;
