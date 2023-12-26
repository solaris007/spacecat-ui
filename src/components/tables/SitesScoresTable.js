import {
  Cell,
  Column,
  Row,
  TableBody,
  TableHeader,
  TableView,
} from '@adobe/react-spectrum';
import React, { useMemo, useState } from 'react';

import { formatMs, formatSeconds, renderExternalLink } from '../../utils/utils';

import SiteRowActions from './actions/SiteRowActions';
import AuditLHSScoreBadge from '../content/AuditLHSScoreBadge';

function SitesScoresTable({ sites, updateSites }) {
  const [sortDescriptor, setSortDescriptor] = useState({ column: 'performance', direction: 'ascending' });

  const sortedSites = useMemo(() => {
    if (!sortDescriptor.column) return sites;

    return [...sites].sort((a, b) => {
      let aValue;
      let bValue;
      if (sortDescriptor.column === 'total-blocking-time') {
        aValue = a.audits[0]?.auditResult.totalBlockingTime;
        bValue = b.audits[0]?.auditResult.totalBlockingTime;
      } else {
        aValue = a.audits[0]?.auditResult.scores[sortDescriptor.column];
        bValue = b.audits[0]?.auditResult.scores[sortDescriptor.column];
      }

      if (sortDescriptor.direction === 'ascending') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });
  }, [sites, sortDescriptor]);

  const handleSortChange = (descriptor) => {
    setSortDescriptor(descriptor);
  };

  return (
    <TableView
      aria-label="Scores List"
      height="size-3600"
      onSortChange={handleSortChange}
      sortDescriptor={sortDescriptor}
    >
      <TableHeader>
        <Column key="baseURL" defaultWidth="0.8fr" allowsResizing>Base URL</Column>
        <Column key="performance" allowsSorting width="0.2fr">Perf</Column>
        <Column key="seo" allowsSorting width="0.2fr">SEO</Column>
        <Column key="accessibility" allowsSorting width="0.2fr">A11Y</Column>
        <Column key="best-practices" allowsSorting width="0.2fr">BP</Column>
        <Column key="total-blocking-time" allowsSorting width="0.2fr">TBT</Column>
        <Column key="actions" width="0.2fr">&nbsp;</Column>
      </TableHeader>
      <TableBody>
        {sortedSites && sortedSites.map((site, index) => (
          <Row key={index}>
            <Cell>{renderExternalLink(site.baseURL)}</Cell>
            <Cell><AuditLHSScoreBadge score={site.audits[0].auditResult.scores.performance} label={index} /></Cell>
            <Cell><AuditLHSScoreBadge score={site.audits[0].auditResult.scores.seo} label={index} /></Cell>
            <Cell><AuditLHSScoreBadge score={site.audits[0].auditResult.scores.accessibility} label={index} /></Cell>
            <Cell><AuditLHSScoreBadge score={site.audits[0].auditResult.scores['best-practices']} label={index} /></Cell>
            <Cell>{formatSeconds(site.audits[0].auditResult.totalBlockingTime)}</Cell>
            <Cell><SiteRowActions site={site} updateSites={updateSites}/></Cell>
          </Row>
        ))}
      </TableBody>
    </TableView>
  )
}

export default SitesScoresTable;
