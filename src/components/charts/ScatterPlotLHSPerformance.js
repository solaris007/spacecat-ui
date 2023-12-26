import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine, Label, LabelList
} from 'recharts';

import { hasAudits } from '../../utils/siteUtils';
import { Content, ContextualHelp, Flex, Heading, Text } from '@adobe/react-spectrum';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "#292929",
          color: "#fff",
          padding: "10px",
          border: "1px solid #ccc"
      }}>
        <p><strong>{data.name}</strong></p>
        <p><strong>Mobile Score:</strong> {data.mobileScore}%</p>
        <p><strong>Desktop Score:</strong> {data.desktopScore}%</p>
      </div>
    );
  }

  return null;
};

function PerformanceScatterPlot({ sites }) {
  const mobileSites = sites['lhs-mobile'].filter((site) => hasAudits(site));
  const desktopSites = sites['lhs-desktop'].filter((site) => hasAudits(site));

  const data = mobileSites.map(mobileSite => {
    const desktopSite = desktopSites.find(ds => ds.baseURL === mobileSite.baseURL);
    return desktopSite ? {
      name: mobileSite.baseURL,
      desktopScore: (desktopSite.audits[0].auditResult.scores.performance * 100).toFixed(),
      mobileScore: (mobileSite.audits[0].auditResult.scores.performance * 100).toFixed(),
    } : null;
  }).filter(Boolean); // Filter out null values in case there's no matching desktop site

  return (
    <Flex direction="column" gap="size-200" width="100%">
      <Flex direction="row" gap="size-200">
        <Text><strong>Performance Scatter</strong></Text>
        <ContextualHelp variant="info">
          <Heading>Performance Scatter Plot</Heading>
          <Content>
            <Text>
              This chart shows the latest performance score for each site on the x and y axis. The dotted line
              represents equal
              performance between mobile and desktop. Sites above the line have better performance on desktop, and sites
              below the line have better performance on mobile.
            </Text>
          </Content>
        </ContextualHelp>
      </Flex>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart>
          <CartesianGrid/>
          <XAxis type="number" dataKey="mobileScore" name="Mobile Score" unit="%" domain={[0, 1]}>
            <Label value="Mobile Score" offset={0} position="insideLeft"/>
          </XAxis>
          <YAxis type="number" dataKey="desktopScore" name="Desktop Score" unit="%" domain={[0, 1]}>
            <Label value="Desktop Score" angle={-90} position="insideLeft"/>
          </YAxis>
          <Tooltip content={<CustomTooltip />} />
          <Legend/>
          <ReferenceLine
            label="Equal Performance"
            segment={[{ x: 0, y: 0 }, { x: 99, y: 99 }]}
            stroke="red"
            strokeDasharray="3 3"
          />
          <Scatter
            data={data}
            fill="rgb(216, 181, 0)"
            name="Performance Score"
            shape="cross"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </Flex>
  );
}

export default PerformanceScatterPlot;
