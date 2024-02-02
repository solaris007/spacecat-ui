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

import SiteRowActions from './actions/SiteRowActions';
import AuditConfigStatus from '../content/AuditConfigStatus';
import LiveStatus from '../content/LiveStatus';

function SitesTable({ sites, auditType, updateSites }) {
  return (
    <TableView
      aria-label="Sites List"
      height="size-3600"
    >
      <TableHeader>
        <Column key="baseURL" width="1fr">Base URL</Column>
        <Column key="gitHubURL" width="1fr">GitHub URL</Column>
        <Column key="liveStatus" width="1fr">Live Status</Column>
        <Column key="auditConfiguration" width="1fr">Audit Config</Column>
        <Column key="updatedAt" width="1fr">Updated</Column>
        <Column key="actions" width="0.2fr">&nbsp;</Column>
      </TableHeader>
      <TableBody>
        {sites && sites.map((site, index) => (
          <Row key={index}>
            <Cell>{renderExternalLink(site.baseURL)}</Cell>
            <Cell>{renderExternalLink(site.gitHubURL)}</Cell>
            <Cell><LiveStatus item={site}/></Cell>
            <Cell><AuditConfigStatus site={site}/></Cell>
            <Cell>{formatDate(site.updatedAt)}</Cell>
            <Cell><SiteRowActions site={site} auditType={auditType} updateSites={updateSites}/></Cell>
          </Row>
        ))}
      </TableBody>
    </TableView>
  )
}

export default SitesTable;
