import {
  Cell,
  Column,
  Row,
  TableBody,
  TableHeader,
  TableView,
} from '@adobe/react-spectrum';
import React from 'react';

import { formatLighthouseError, renderExternalLink } from '../../utils/utils';

import SiteRowActions from './actions/SiteRowActions';

function SitesErrorsTable({ sites }) {
  return (
    <TableView
      aria-label="Error List"
      height="size-3600"
      overflowMode="wrap"
    >
      <TableHeader>
        <Column key="baseURL" defaultWidth="0.7fr" allowsResizing>Base URL</Column>
        <Column key="error" defaultWidth="2fr">Error</Column>
        <Column key="actions" width="0.3fr">&nbsp;</Column>
      </TableHeader>
      <TableBody>
        {sites && sites.map((site, index) => (
          <Row key={index}>
            <Cell>{renderExternalLink(site.baseURL)}</Cell>
            <Cell>{formatLighthouseError(site.audits[0].auditResult.runtimeError)}</Cell>
            <Cell><SiteRowActions site={site}/></Cell>
          </Row>
        ))}
      </TableBody>
    </TableView>
  )
}

export default SitesErrorsTable;
