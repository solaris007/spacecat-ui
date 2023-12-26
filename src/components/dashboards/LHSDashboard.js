import { Flex, Grid, Item, Picker, View } from '@adobe/react-spectrum';
import { ToastQueue } from '@react-spectrum/toast';
import React, { useEffect, useState } from 'react';

import { getSitesWithLatestAudits } from '../../service/apiService';
import { hasAudits, hasLiveStatus, isAuditDisabled } from '../../utils/siteUtils';

import SitesScoresTable from '../tables/SitesScoresTable';
import SitesErrorsTable from '../tables/SitesErrorsTable';
import SitesDisabledTable from '../tables/SitesDisabledTable';
import AggregatedBarChartPSIScores from '../charts/AggregatedBarChartPSIScores';
import ScatterPlotLHSPerformance from '../charts/ScatterPlotLHSPerformance';

const STRATEGIES = {
  LHS_DESKTOP: 'lhs-desktop',
  LHS_MOBILE: 'lhs-mobile',
}

function LHSDashboard({ onLoadingComplete, onLoadingText, onDashboardTitle }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [liveStatus, setLiveStatus] = useState('all');
  const [sites, setSites] = useState({ 'lhs-desktop': [], 'lhs-mobile': [] });
  const [strategy, setStrategy] = useState(STRATEGIES.LHS_MOBILE);

  onDashboardTitle('Lighthouse Scores');

  useEffect(() => {
    const fetchData = async () => {
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
        onLoadingComplete(false);}
    };

    fetchData();
  }, []);

  if (!isLoaded) {
    return null;
  }

  const strategySites = sites[strategy];

  const filteredSites = strategySites.filter(site => hasLiveStatus(site, liveStatus));
  const scoredSites = filteredSites.filter(site => hasAudits(site) && !site.audits[0].isError);
  const errorSites = filteredSites.filter(site => hasAudits(site) && site.audits[0].isError);
  const disabledSites = filteredSites.filter(site => isAuditDisabled(site, strategy));

  return (
    <Grid
      areas={{
        base: [
          'controls',
          'charts',
          'table-scores',
          'table-errors',
          'table-disabled',
        ],
        M: [
          'controls controls',
          'charts charts',
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
            labelPosition="side"
            defaultSelectedKey="lhs-mobile"
            onSelectionChange={setStrategy}
          >
            <Item key="lhs-desktop">Desktop</Item>
            <Item key="lhs-mobile">Mobile</Item>
          </Picker>
          <Picker
            label="Live Status"
            labelPosition="side"
            defaultSelectedKey="all"
            onSelectionChange={setLiveStatus}
          >
            <Item key="all">All</Item>
            <Item key="live">Live</Item>
            <Item key="non-live">Non-Live</Item>
          </Picker>
        </Flex>
      </View>
      <View gridArea="charts">
        <Flex direction="row" justifyContent="start" alignItems="center" gap="size-150">
          <AggregatedBarChartPSIScores sites={scoredSites}/>
          <ScatterPlotLHSPerformance sites={sites}/>
        </Flex>
      </View>
      <View gridArea="table-scores">
        <h2>Scores ({scoredSites.length})</h2>
        <SitesScoresTable sites={scoredSites}/>
      </View>
      <View gridArea="table-errors">
        <h2>Errors ({errorSites.length})</h2>
        <SitesErrorsTable sites={errorSites}/>
      </View>
      <View gridArea="table-disabled">
        <h2>Disabled ({disabledSites.length})</h2>
        <SitesDisabledTable sites={disabledSites}/>
      </View>
    </Grid>
  );
}

export default LHSDashboard;
