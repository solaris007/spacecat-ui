import {
  ActionButton,
  Divider,
  Flex,
  Grid,
  Heading,
  Item,
  Picker,
  ProgressCircle,
  Text,
  View,
} from '@adobe/react-spectrum';
import { ToastQueue } from '@react-spectrum/toast';
import Edit from '@spectrum-icons/workflow/Edit';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart, ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { getAuditsOfTypeForSite, getSite, updateSite } from '../service/apiService';
import { formatDate, renderExternalLink } from '../utils/utils';

import LiveStatus from './content/LiveStatus';
import AuditConfigStatus from './content/AuditConfigStatus';
import SiteFormDialog from './dialogs/SiteFormDialog';
import FinalURLFrequencyChart from './charts/FinalURLFrequencyChart';
import AuditsTable from './tables/AuditsTable';
import ElementWithCopyAction from './content/ElementWithCopyAction';


const SiteDetails = () => {
  const { siteId } = useParams();
  const [auditType, setAuditType] = useState('lhs-mobile');
  const [audits, setAudits] = useState(null);
  const [isAuditsLoading, setIsAuditsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSiteEditDialogOpen, setIsSiteEditDialogOpen] = useState(false);
  const [siteData, setSiteData] = useState(null);
  const [timeRange, setTimeRange] = useState(7);

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

  const transformAuditsToChartData = (audits) => {
    const now = new Date();
    const scoresData = [];
    const seoScores = { high: 0, medium: 0, low: 0 };
    const errorRateData = [];
    const urlFrequencyData = {};

    const filteredAudits = audits ? audits.filter(audit => {
        const auditedDate = new Date(audit.auditedAt);
        return now - auditedDate <= timeRange * 24 * 60 * 60 * 1000;
      })
      : [];

    filteredAudits.forEach(audit => {
      const formattedDate = formatDate(audit.auditedAt);
      const auditResult = audit.auditResult;

      // Error Rate
      errorRateData[audit.auditedAt] = (errorRateData[audit.auditedAt] || 0) + (audit.isError ? 1 : 0);

      // Final URL Frequency
      const urlKey = auditResult.finalUrl;
      urlFrequencyData[urlKey] = (urlFrequencyData[urlKey] || 0) + 1;

      if (!audit.isError) {
        // SEO Score distribution
        const seoScore = auditResult.scores.seo;
        if (seoScore >= 0.9) seoScores.high += 1;
        else if (seoScore >= 0.5) seoScores.medium += 1;
        else seoScores.low += 1;

        // LHS Scores
        scoresData.push({
          date: formattedDate,
          performance: auditResult.scores.performance,
          seo: auditResult.scores.seo,
          accessibility: auditResult.scores.accessibility,
          'best-practices': auditResult.scores['best-practices'],
          totalBlockingTime: auditResult.totalBlockingTime,
        });
      } else {
        scoresData.push({
          date: formattedDate,
          performance: null,
          seo: null,
          accessibility: null,
          'best-practices': null,
          totalBlockingTime: null,
        });
      }
    });

    // Calculate error rate percentages
    const errorRate = Object.entries(errorRateData).map(([date, errorCount]) => ({
      date,
      errorRate: (errorCount / audits.length) * 100
    }));

    return {
      scoresData: scoresData.reverse(),
      errorRateData: errorRate.reverse(),
      seoScores,
      urlFrequencyData,
    };
  };

  const chartData = transformAuditsToChartData(audits);

  const formatDateForAxis = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  };

  const formatPercentForAxis = (decimal) => {
    return `${(decimal * 100).toFixed(0)}%`;
  };

  const formatMillisToSeconds = (millis) => {
    return `${(millis / 1000).toFixed(2)}s`;
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
          'charts',
        ],
        M: [
          'header header',
          'info audits',
          'charts charts',
        ],
      }}
      columns={{
        base: ['1fr'],
        M: ['1fr', '3fr'],
      }}
      rows={['auto', 'auto', 'auto']}
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
        <Flex direction="column" gap="size-150">
          <Text><strong>ID</strong></Text>
          <ElementWithCopyAction element={siteData.id} value={siteData.id}/>
          <Text><strong>Base URL</strong></Text>
          <Text>{renderExternalLink(siteData.baseURL)}</Text>
          <Text><strong>GitHub URL&nbsp;</strong></Text>
          <Text>{renderExternalLink(siteData.gitHubURL)}</Text>
          <Flex direction="row" justifyContent="space-between">
            <Flex direction="row" alignItems="center">
              <Text><strong>Live Status:</strong></Text>
              <LiveStatus item={siteData}/>
            </Flex>
            <Flex direction="row" alignItems="center">
              <Text><strong>Audits Enabled:</strong></Text>
              <AuditConfigStatus site={siteData}/>
            </Flex>
          </Flex>
          <Divider size="S"/>
          <Flex direction="row" justifyContent="space-between">
            <Flex direction="row" alignItems="start" gap="size-200">
              <Text><strong>Updated</strong></Text>
              <Text>{formatDate(siteData.updatedAt)}</Text>
            </Flex>
            <Flex direction="row" alignItems="start" gap="size-200">
              <Text><strong>Created</strong></Text>
              <Text>{formatDate(siteData.createdAt)}</Text>
            </Flex>
          </Flex>
        </Flex>
      </View>
      <View gridArea="audits">
        <View borderWidth="thin" borderColor="dark" borderRadius="medium" padding="size-250">
          <Flex direction="column" gap="size-100">
            <Picker label="Audit Type" selectedKey={auditType} onSelectionChange={setAuditType}>
              <Item key="lhs-desktop">LHS Desktop</Item>
              <Item key="lhs-mobile">LHS Mobile</Item>
            </Picker>
            {isAuditsLoading ? (
              <ProgressCircle aria-label="Loading Audits…" isIndeterminate/>
            ) : (
              <AuditsTable auditType={auditType} audits={audits}/>
            )}
          </Flex>
        </View>
      </View>
      <View gridArea="charts">
        <View borderWidth="thin" borderColor="dark" borderRadius="medium" padding="size-250">
          <Flex direction="column" gap="size-100">
            <Flex direction="row" alignItems="center" gap="size-100">
              <Picker label="Time Range" selectedKey={timeRange.toString()}
                      onSelectionChange={(selected) => setTimeRange(Number(selected))}>
                <Item key="3">Last 3 Days</Item>
                <Item key="7">Last 7 Days</Item>
                <Item key="14">Last 14 Days</Item>
                <Item key="30">Last 30 Days</Item>
              </Picker>
            </Flex>
            {isAuditsLoading ? (
              <ProgressCircle aria-label="Loading Audits…" isIndeterminate/>
            ) : (
              <Flex direction="column" gap="size-300">
                <Flex direction="row" gap="size-300">
                  <View width="50%">
                    <Heading level={3}>Scores</Heading>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={chartData.scoresData}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="date" tickFormatter={formatDateForAxis}/>

                        {/* Left Y-axis for LHS Scores */}
                        <YAxis yAxisId="left" tickFormatter={formatPercentForAxis}/>
                        {/* Right Y-axis for TBT */}
                        <YAxis yAxisId="right" orientation="right" tickFormatter={formatMillisToSeconds}/>

                        <Tooltip contentStyle={{ backgroundColor: '#292929', color: 'white' }}/>
                        <Legend/>

                        {/* Lines for LHS Scores */}
                        <Line yAxisId="left" type="monotone" dataKey="performance" stroke="#8884d8"/>
                        <Line yAxisId="left" type="monotone" dataKey="seo" stroke="#82ca9d"/>
                        <Line yAxisId="left" type="monotone" dataKey="accessibility" stroke="#ffc658"/>
                        <Line yAxisId="left" type="monotone" dataKey="best-practices" stroke="#ff7300"/>

                        {/* Line for TBT */}
                        <Line yAxisId="right" type="monotone" dataKey="totalBlockingTime" stroke="#ff0000" dot={false}/>

                      </LineChart>
                    </ResponsiveContainer>
                  </View>
                  <View width="50%">
                    <Heading level={3}>Error Rate</Heading>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={chartData.errorRateData}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="date" tickFormatter={formatDateForAxis}/>
                        <YAxis/>
                        <Tooltip contentStyle={{ backgroundColor: '#292929', color: 'white' }}/>
                        <Legend/>
                        <Line type="monotone" dataKey="errorRate" stroke="#ff0000"/>
                      </LineChart>
                    </ResponsiveContainer>
                  </View>
                </Flex>
                <Flex direction="row" gap="size-300">
                  <View width="50%">
                    <Heading level={3}>Final URL Distribution</Heading>
                    <ResponsiveContainer width="100%">
                      <FinalURLFrequencyChart data={chartData.urlFrequencyData}/>
                    </ResponsiveContainer>
                  </View>
                </Flex>
              </Flex>
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
