import { Grid, View } from '@adobe/react-spectrum';
import { ToastQueue } from '@react-spectrum/toast';
import React, { useEffect, useState } from 'react';

import { getSitesWithLatestAudits } from '../../service/apiService';
import SitesScoresTable from '../tables/SitesScoresTable';
import SitesErrorsTable from '../tables/SitesErrorsTable';
import SitesDisabledTable from '../tables/SitesDisabledTable';
import AggregatedBarChartPSIScores from '../charts/AggregatedBarChartPSIScores';

function LHSDashboard({ auditType, onLoadingComplete }) {
  const [sites, setSites] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoaded(false);
        onLoadingComplete(true);
        const data = await getSitesWithLatestAudits(auditType);
        setSites(data);
        setIsLoaded(true);
      } catch (error) {
        console.error('Error fetching data:', error);
        ToastQueue.negative('Error fetching data', { timeout: 5000 });
      } finally {
        onLoadingComplete(false);}
    };

    fetchData();
  }, [auditType]);

  if (!isLoaded) {
    return null;
  }

  const scoredSites = sites.filter(site => Array.isArray(site.audits) && site.audits.length === 1 && !site.audits[0].isError);
  const errorSites = sites.filter(site => Array.isArray(site.audits) && site.audits.length === 1 && site.audits[0].isError);
  const disabledSites = sites.filter(site => site.auditConfig.auditsDisabled || site.auditConfig.auditTypeConfigs[auditType]?.disabled);

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
        <h2>Challenged</h2>
        <SitesScoresTable sites={scoredSites} auditType={auditType}/>
      </View>
      <View gridArea="table-errors">
        <h2>Errored</h2>
        <SitesErrorsTable sites={errorSites} auditType={auditType}/>
      </View>
      <View gridArea="table-disabled">
        <h2>Disabled</h2>
        <SitesDisabledTable sites={disabledSites} auditType={auditType}/>
      </View>
    </Grid>
  );
}

export default LHSDashboard;
