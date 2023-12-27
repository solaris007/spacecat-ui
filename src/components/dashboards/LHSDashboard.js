import { ActionButton, Flex, Grid, Item, Picker, Tooltip, TooltipTrigger, View } from '@adobe/react-spectrum';
import { ToastQueue } from '@react-spectrum/toast';
import React, { useEffect, useState } from 'react';

import { getSitesWithLatestAudits } from '../../service/apiService';
import { hasAudits, hasLiveStatus, isAuditDisabled } from '../../utils/siteUtils';

import AggregatedBarChartPSIScores from '../charts/AggregatedBarChartPSIScores';
import FullscreenChart from '../charts/FullscreenChart';
import PerformanceScatterPlot from '../charts/PerformanceScatterPlot';
import SitesDisabledTable from '../tables/SitesDisabledTable';
import SitesErrorsTable from '../tables/SitesErrorsTable';
import SitesScoresTable from '../tables/SitesScoresTable';
import LiveStatusPicker from '../pickers/LiveStatusPicker';
import Refresh from '@spectrum-icons/workflow/Refresh';
import SitesPSILeaderboard from '../tables/SitesPSILeaderboard';

const STRATEGIES = {
  LHS_DESKTOP: 'lhs-desktop',
  LHS_MOBILE: 'lhs-mobile',
}

function LHSDashboard({ onLoadingComplete, onLoadingText, onDashboardTitle }) {
  const [disabledSites, setDisabledSites] = useState([]);
  const [errorSites, setErrorSites] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [liveStatus, setLiveStatus] = useState('all');
  const [scoredSites, setScoredSites] = useState([]);
  const [sites, setSites] = useState({ 'lhs-desktop': [], 'lhs-mobile': [] });
  const [strategy, setStrategy] = useState(STRATEGIES.LHS_MOBILE);

  useEffect(() => {
    onDashboardTitle('Lighthouse Scores');
  }, [onDashboardTitle]);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    try {
      setIsLoaded(false);
      onLoadingComplete(true);
      const data = {};
      for (const auditType of Object.values(STRATEGIES)) {
        onLoadingText(`Loading Lighthouse Scores (${auditType})...`);
        data[auditType] = await getSitesWithLatestAudits(auditType);
      }
      setSites(data);
      setIsLoaded(true);
    } catch (error) {
      console.error('Error fetching data:', error);
      ToastQueue.negative('Error fetching data', { timeout: 5000 });
    } finally {
      onLoadingComplete(false);
    }
  };

  useEffect(() => {
    const strategySites = sites[strategy];

    const filteredSites = strategySites.filter(site => hasLiveStatus(site, liveStatus));
    const newScoredSites = filteredSites.filter(site => hasAudits(site) && !site.audits[0].isError);
    const newErrorSites = filteredSites.filter(site => hasAudits(site) && site.audits[0].isError);
    const newDisabledSites = filteredSites.filter(site => isAuditDisabled(site, strategy));

    // Update state for each table
    setScoredSites(newScoredSites);
    setErrorSites(newErrorSites);
    setDisabledSites(newDisabledSites);
  }, [sites, strategy, liveStatus]);

  const updateSitesState = (updatedSite) => {
    setSites(prevSites => {
      const newSites = {...prevSites};
      for (const strategy in newSites) {
        newSites[strategy] = newSites[strategy].map(site =>
          site.id === updatedSite.id ? { ...site, ...updatedSite } : site
        );
      }
      return newSites;
    });
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <Grid
      areas={{
        base: [
          'controls',
          'charts',
          'table-winners',
          'table-scores',
          'table-errors',
          'table-disabled',
        ],
        M: [
          'controls controls',
          'charts charts',
          'table-winners table-winners',
          'table-scores table-errors',
          'table-disabled table-disabled'
        ],
      }}
      columns={{
        base: ['1fr'],
        L: ['1fr', '1fr'],
      }}
      gap="size-200"
    >
      <View gridArea="controls">
        <Flex direction="row" justifyContent="start" alignItems="center" gap="size-150">
          <Picker
            label="Strategy"
            name="strategy-picker"
            labelPosition="side"
            defaultSelectedKey="lhs-mobile"
            onSelectionChange={setStrategy}
          >
            <Item key="lhs-desktop">Desktop</Item>
            <Item key="lhs-mobile">Mobile</Item>
          </Picker>
          <TooltipTrigger>
            <ActionButton onPress={refreshData} aria-label="Refresh Sites">
              <Refresh size="S"/>
            </ActionButton>
            <Tooltip>Refresh Sites</Tooltip>
          </TooltipTrigger>
          <LiveStatusPicker onSelectionChange={setLiveStatus}/>
        </Flex>
      </View>
      <View gridArea="charts">
        <Flex direction="row" justifyContent="start" alignItems="center" gap="size-300">
          <FullscreenChart
            title="Performance Scatter Plot"
            chart={PerformanceScatterPlot}
            chartProps={{ sites }}
            />
          <AggregatedBarChartPSIScores sites={scoredSites}/>
        </Flex>
      </View>
      <View gridArea="table-scores">
        <h2>Scores ({scoredSites.length})</h2>
        <SitesScoresTable sites={scoredSites} auditType={strategy} updateSites={updateSitesState}/>
      </View>
      <View gridArea="table-winners">
        <h2>Winners ({scoredSites.length})</h2>
        <SitesPSILeaderboard showWinners={true} sites={scoredSites} auditType={strategy} updateSites={updateSitesState}/>
      </View>
      <View gridArea="table-errors">
        <h2>Errors ({errorSites.length})</h2>
        <SitesErrorsTable sites={errorSites} auditType={strategy} updateSites={updateSitesState}/>
      </View>
      <View gridArea="table-disabled">
        <h2>Disabled ({disabledSites.length})</h2>
        <SitesDisabledTable sites={disabledSites} auditType={strategy} updateSites={updateSitesState}/>
      </View>
    </Grid>
  );
}

export default LHSDashboard;
