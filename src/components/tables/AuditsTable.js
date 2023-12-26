import {
  ActionBar,
  ActionBarContainer,
  Cell,
  Column, Flex,
  Item,
  Row,
  TableBody,
  TableHeader,
  TableView,
  Text,
} from '@adobe/react-spectrum';
import Compare from '@spectrum-icons/workflow/Compare';
import Globe from '@spectrum-icons/workflow/Globe';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { createActionHandler } from '../../utils/siteUtils';
import { createActionBarItems, formatDate, renderExternalLink } from '../../utils/utils';

import AuditLHSScoreStatus from '../content/AuditLHSScoreStatus';
import LiveStatus from '../content/LiveStatus';
import ErrorStatus from '../content/ErrorStatus';
import AuditsRowActions from './actions/AuditsRowActions';

const actionBarItemConfig = [
  { key: 'psi-diff', label: 'Compare PSI Reports', icon: <Compare/>, maxSelections: 2, minSelections: 2 },
  { key: 'psi-report', label: 'PSI Report', icon: <Globe/>, maxSelections: 1 },
];

function AuditsTable({ auditType, audits }) {
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [selectedAudits, setSelectedAudits] = useState([]);
  const navigate = useNavigate();

  const actionBarItems = createActionBarItems(actionBarItemConfig, selectedKeys);

  const clearTableSelections = () => {
    setSelectedKeys(new Set([]));
  }

  const handleSelectionChange = (keys) => {
    if (keys === 'all') {
      setSelectedKeys(keys);
    } else {
      setSelectedKeys(new Set(keys));
    }
    setSelectedAudits(audits.filter((audit, index) => keys === 'all' || keys.has(`${index}`)));
  }

  const handleAction = createActionHandler({ audits: selectedAudits.reverse(), navigate })

  return (
    <Flex direction="column" gap="size-100">
      <Text>Showing ${audits.length} audits. Select two audits to compare them!</Text>
      <ActionBarContainer height="size-3600">
        <TableView
          aria-label="Audit List"
          onSelectionChange={handleSelectionChange}
          selectedKeys={selectedKeys}
          selectionMode="multiple"
          selectionStyle="checkbox"
        >
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
                <Cell><AuditLHSScoreStatus audit={audit}/></Cell>
                <Cell><LiveStatus item={audit}/></Cell>
                <Cell><ErrorStatus item={audit}/></Cell>
                <Cell><AuditsRowActions audit={audit} auditType={auditType}/></Cell>
              </Row>
            ))}
          </TableBody>
        </TableView>
        <ActionBar
          isEmphasized
          items={actionBarItems}
          selectedItemCount={selectedKeys === 'all' ? 'all' : selectedKeys.size}
          onAction={handleAction}
          onClearSelection={clearTableSelections}
        >
          {(item) => (
            <Item key={item.key}>
              {item.icon}
              <Text>{item.label}</Text>
            </Item>
          )}
        </ActionBar>
      </ActionBarContainer>
    </Flex>
  )
}

export default AuditsTable;
