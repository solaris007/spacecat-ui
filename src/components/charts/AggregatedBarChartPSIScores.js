import {
  Content,
  ContextualHelp,
  Flex,
  Heading,
  Item,
  Picker,
  Text,
} from '@adobe/react-spectrum';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import React, { useState } from 'react';

const aggregateData = (sites, liveStatus) => {
  switch(liveStatus) {
    case 'live':
      sites = sites.filter(site => site.isLive);
      break;
    case 'non-live':
      sites = sites.filter(site => !site.isLive);
      break;
    default:
      break;
  }

  // Initialize an object to store the count for each score range and metric
  const ranges = {
    '0-0.2': { 'best-practices': 0, performance: 0, seo: 0, accessibility: 0 },
    '0.2-0.4': { 'best-practices': 0, performance: 0, seo: 0, accessibility: 0 },
    '0.4-0.6': { 'best-practices': 0, performance: 0, seo: 0, accessibility: 0 },
    '0.6-0.8': { 'best-practices': 0, performance: 0, seo: 0, accessibility: 0 },
    '0.8-1.0': { 'best-practices': 0, performance: 0, seo: 0, accessibility: 0 },
  };

  // Function to determine the range of a given score
  const getRange = (score) => {
    if (score <= 0.2) return '0-0.2';
    if (score <= 0.4) return '0.2-0.4';
    if (score <= 0.6) return '0.4-0.6';
    if (score <= 0.8) return '0.6-0.8';
    return '0.8-1.0';
  };

  // Iterate over the data to fill the ranges object
  sites.forEach(site => {
    const scores = site.audits[0].auditResult.scores;
    Object.keys(scores).forEach(metric => {
      const range = getRange(scores[metric]);
      ranges[range][metric]++;
    });
  });

  // Convert the ranges object to an array format suitable for Recharts
  return Object.entries(ranges).map(([name, values]) => ({ name, ...values }));
};

function AggregatedBarChartPSIScores({ sites }) {
  const [liveStatus, setLiveStatus] = useState('all');
  const aggregatedData = aggregateData(sites, liveStatus);

  return (
    <Flex direction="column" gap="size-200">
      <Flex direction="row" gap="size-200">
        <Text><strong>Aggregated Scores</strong></Text>
        <ContextualHelp variant="info">
          <Heading>Aggregated Scores Bar Chart</Heading>
          <Content>
            <Text>
              This chart provides a visual representation of how different websites score in various performance categories. Instead of showing a bar for each individual site, we've aggregated the data into distinct performance score ranges (for example, 0-0.2, 0.2-0.4, etc.). Each bar in the chart represents the number of sites that fall into these score ranges.
            </Text>
          </Content>
        </ContextualHelp>
        <Picker
          label="Live Status"
          width="size-2400"
          onSelectionChange={setLiveStatus}
          selectedKey={liveStatus}
        >
          <Item key="all">All</Item>
          <Item key="live">Live</Item>
          <Item key="non-live">Not Live</Item>
        </Picker>
      </Flex>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart width={600} height={300} data={aggregatedData}>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="name"/>
          <YAxis domain={[0, Math.ceil(sites.length / 10) * 10]}/>
          <Tooltip/>
          <Legend/>
          <Bar dataKey="performance" fill="rgb(216, 181, 0)"/>
          <Bar dataKey="seo" fill="rgb(227, 69, 137)"/>
          <Bar dataKey="accessibility" fill="rgb(211, 65, 213)"/>
          <Bar dataKey="best-practices" fill="rgb(162, 94, 246)"/>
        </BarChart>
      </ResponsiveContainer>
    </Flex>
  );
}

export default AggregatedBarChartPSIScores;
