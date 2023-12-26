import {
  Cell,
  Column,
  Row,
  TableBody,
  TableHeader,
  TableView,
} from '@adobe/react-spectrum';
import React from 'react';

import { renderExternalLink } from '../../utils/utils';

import SiteRowActions from './actions/SiteRowActions';
import AuditConfigStatus from '../content/AuditConfigStatus';

function SitesDisabledTable({ sites, updateSites }) {
  return (
    <TableView
      aria-label="Disabled List"
      height="size-3600"
    >
      <TableHeader>
        <Column key="baseURL" width="1.8fr">Base URL</Column>
        <Column key="auditConfiguration" width="1fr">Audit Config</Column>
        <Column key="actions" width="0.2fr">&nbsp;</Column>
      </TableHeader>
      <TableBody>
        {sites && sites.map((site, index) => (
          <Row key={index}>
            <Cell>{renderExternalLink(site.baseURL)}</Cell>
            <Cell><AuditConfigStatus site={site}/></Cell>
            <Cell><SiteRowActions site={site} updateSites={updateSites}/></Cell>
          </Row>
        ))}
      </TableBody>
    </TableView>
  )
}

export default SitesDisabledTable;
