import { Grid, View } from '@adobe/react-spectrum';
import { ToastQueue } from '@react-spectrum/toast';
import React, { useEffect, useState } from 'react';

import { getSitesWithLatestAudits } from '../../service/apiService';
import SitesScoresTable from '../tables/SitesScoresTable';
import SitesErrorsTable from '../tables/SitesErrorsTable';
import SitesDisabledTable from '../tables/SitesDisabledTable';
import AggregatedBarChartPSIScores from '../charts/AggregatedBarChartPSIScores';

function LHSDashboard({ onLoadingComplete, onLoadingText, onDashboardTitle }) {
  const [sites, setSites] = useState({ 'lhs-desktop': [], 'lhs-mobile': [] });
  const [isLoaded, setIsLoaded] = useState(false);
  onDashboardTitle('Lighthouse Scores');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoaded(false);
        onLoadingComplete(true);
        const data = {};
        for (const auditType of ['lhs-desktop', 'lhs-mobile']) {
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

  const scoredSites = sites['lhs-mobile'].filter(site => Array.isArray(site.audits) && site.audits.length === 1 && !site.audits[0].isError);
  const errorSites = sites['lhs-mobile'].filter(site => Array.isArray(site.audits) && site.audits.length === 1 && site.audits[0].isError);
  const disabledSites = sites['lhs-mobile'].filter(site => site.auditConfig.auditsDisabled || site.auditConfig.auditTypeConfigs['lhs-mobile']?.disabled);

  return (
    <Grid
      areas={{
        base: [
          'charts',
          'table-scores',
          'table-errors',
          'table-disabled',
        ],
        M: [
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
      <View gridArea="charts">
        <AggregatedBarChartPSIScores sites={scoredSites}/>
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
