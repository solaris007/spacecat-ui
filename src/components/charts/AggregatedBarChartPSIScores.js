import {
  Content,
  ContextualHelp,
  Flex,
  Heading,
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
import React from 'react';

const aggregateData = (sites) => {
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
  const aggregatedData = aggregateData(sites);

  return (
    <Flex direction="column" gap="size-200" width="100%">
      <Flex direction="row" gap="size-200" alignItems="center">
        <Heading level={3} margin="size-150">Aggregated Scores</Heading>
        <ContextualHelp variant="info">
          <Heading>Aggregated Scores Help</Heading>
          <Content>
            <Text>
              This chart shows the aggregated scores based on the latest audit for each site. The scores are grouped
              into ranges of 0.2. For example,
              the first bar shows the number of sites with a score between 0 and 0.2 for the four lighthouse scores. The
              second bar shows the number of sites with a score between 0.2 and 0.4 for the four lighthouse scores, and
              so on.
            </Text>
          </Content>
        </ContextualHelp>
      </Flex>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart width={600} height={300} data={aggregatedData}>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis dataKey="name"/>
          <YAxis domain={[0, Math.ceil(sites.length / 10) * 10]}/>
          <Tooltip contentStyle={{ backgroundColor: '#292929', color: 'white' }}/>
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
