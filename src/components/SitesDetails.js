import {
  ActionButton, Cell, Column, Divider,
  Flex,
  Grid,
  Heading, Item, Link, Picker,
  ProgressCircle, Row, TableBody, TableHeader, TableView,
  Text,
  View,
} from '@adobe/react-spectrum';
import { ToastQueue } from '@react-spectrum/toast';
import Edit from '@spectrum-icons/workflow/Edit';
import Actions from '@spectrum-icons/workflow/Actions';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { getAuditsOfTypeForSite, getSite, updateSite } from '../service/apiService';
import { formatDate, renderExternalLink } from '../utils/utils';

import LiveStatus from './LiveStatus';
import AuditConfigStatus from './AuditConfigStatus';
import SiteFormDialog from './SiteFormDialog';
import Globe from '@spectrum-icons/workflow/Globe';
import ErrorStatus from './ErrorStatus';
import AuditScoreStatus from './AuditScoreStatus';

const SiteDetails = () => {
  const { siteId } = useParams();
  const [auditType, setAuditType] = useState('lhs-mobile');
  const [audits, setAudits] = useState(null);
  const [isAuditsLoading, setIsAuditsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSiteEditDialogOpen, setIsSiteEditDialogOpen] = useState(false);
  const [siteData, setSiteData] = useState(null);

  useEffect(() => {
    const fetchSiteData = async () => {
      try {
        const data = await getSite(siteId);
        setSiteData(data);
      } catch (error) {
        console.error('Error fetching site details:', error);
        ToastQueue.negative('Error fetching site details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSiteData();
  }, [siteId]);

  useEffect(() => {
    const fetchAudits = async (type) => {
      setIsAuditsLoading(true);
      try {
        const auditData = await getAuditsOfTypeForSite(siteId, type);
        setAudits(auditData);
      } catch (error) {
        console.error('Error fetching audits:', error);
        ToastQueue.negative('Error fetching audits');
      } finally {
        setIsAuditsLoading(false);
      }
    };

    if (auditType) {
      fetchAudits(auditType);
    }
  }, [auditType, siteId]);

  const onEditSite = () => {
    setIsSiteEditDialogOpen(true);
  };

  const handleEditSite = async (siteData) => {
    await updateSite(siteId, siteData);
    setIsSiteEditDialogOpen(false);
    setSiteData(siteData);
    ToastQueue.positive('Site updated successfully', { timeout: 5000 });
  }

  if (isLoading) {
    return (
      <Flex alignItems="center" justifyContent="center" height="100%">
        <ProgressCircle aria-label="Loading…" isIndeterminate/>
      </Flex>
    );
  }

  return (
    <Grid
      areas={{
        base: [
          'header',
          'info',
          'audits',
        ],
        M: [
          'header header',
          'info audits',
        ],
      }}
      columns={{
        base: ['1fr'],
        M: ['1fr', '1fr'],
      }}
      rows={['auto', 'auto']}
      gap="size-200"
    >
      <View gridArea="header">
        <Heading level={1}>Site Details for {siteData.baseURL}</Heading>
        <Flex direction="row" alignSelf="start" gap="size-150">
          <ActionButton
            aria-label="Edit Site"
            alignSelf="start"
            onPress={onEditSite}
          >
            <Edit size="S"/>
            <Text>Edit Site</Text>
          </ActionButton>
        </Flex>
      </View>
      <View gridArea="info"
            borderWidth="thin"
            borderColor="dark"
            borderRadius="medium"
            padding="size-250"
      >
        <Flex direction="column" gap="size-100">
          <Text>Site Information</Text>
          <Divider size="S"/>
          <Text>
            <strong>Base URL:&nbsp;</strong>
            {renderExternalLink(siteData.baseURL)}
          </Text>
          <Text>
            <strong>GitHub URL:&nbsp;</strong>
            {renderExternalLink(siteData.gitHubURL)}
          </Text>
          <Text><strong>Created At:</strong> {formatDate(siteData.createdAt)}</Text>
          <Text><strong>Updated At:</strong> {formatDate(siteData.updatedAt)}</Text>
          <Flex direction="row" alignItems="center">
            <Text><strong>Live:</strong></Text>
            <LiveStatus item={siteData}/>
          </Flex>
          <Flex direction="row" alignItems="center">
            <Text><strong>Audits:</strong></Text>
            <AuditConfigStatus site={siteData}/>
          </Flex>
        </Flex>
      </View>
      <View gridArea="audits">
        <View borderWidth="thin" borderColor="dark" borderRadius="medium" padding="size-250">
          <Flex direction="column" gap="size-100">
            <Text>Audits</Text>
            <Divider size="S"/>
            <Picker label="Audit Type" selectedKey={auditType} onSelectionChange={setAuditType}>
              <Item key="lhs-desktop">LHS Desktop</Item>
              <Item key="lhs-mobile">LHS Mobile</Item>
            </Picker>
            {isAuditsLoading ? (
              <ProgressCircle aria-label="Loading Audits…" isIndeterminate/>
            ) : (
              <TableView aria-label="Audit List" height="size-2400">
                <TableHeader>
                  <Column key="auditedAt" width="0.6fr">Audited At</Column>
                  <Column key="fullAuditRef">Scores</Column>
                  <Column key="isLive" width="0.2fr">Live</Column>
                  <Column key="isError" width="0.2fr">Error</Column>
                  <Column key="actions" width="0.2fr"><Actions size="S"/></Column>
                </TableHeader>
                <TableBody>
                  {audits && audits.map((audit, index) => (
                    <Row key={index}>
                      {/* Define cells */}
                      <Cell>{formatDate(audit.auditedAt)}</Cell>
                      <Cell><AuditScoreStatus audit={audit}/></Cell>
                      <Cell><LiveStatus item={audit}/></Cell>
                      <Cell><ErrorStatus item={audit}/></Cell>
                      <Cell>
                        <Link href={`https://googlechrome.github.io/lighthouse/viewer/?jsonurl=${audit.fullAuditRef}`}
                              rel="noopener noreferrer" target="_blank">
                          <Globe size="S"/>
                        </Link>
                      </Cell>
                    </Row>
                  ))}
                </TableBody>
              </TableView>
            )}
          </Flex>
        </View>
      </View>
      <SiteFormDialog
        isOpen={isSiteEditDialogOpen}
        onClose={() => {
          setIsSiteEditDialogOpen(false);
        }}
        onSubmit={handleEditSite}
        siteData={siteData}
      />
    </Grid>
  );
};

export default SiteDetails;
