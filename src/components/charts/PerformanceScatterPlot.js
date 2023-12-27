import React, { useEffect, useMemo } from 'react';
import {
  CartesianGrid,
  Label,
  Legend,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { hasAudits } from '../../utils/siteUtils';

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
        <p><strong>Mobile Score:</strong> {data.mobileScore.toFixed()}%</p>
        <p><strong>Desktop Score:</strong> {data.desktopScore.toFixed()}%</p>
      </div>
    );
  }

  return null;
};

function PerformanceScatterPlot({ sites, setContextualHelpText, isFullScreen }) {
  useEffect(() => {
    setContextualHelpText(
      'This chart shows the performance scores of the latest Lighthouse audits for each site. ' +
      'The x-axis represents the mobile totalBlockingTime, and the y-axis represents the desktop totalBlockingTime. ' +
      'The red line represents equal performance between mobile and desktop. ' +
      'The green area represents the 90% area, where the mobile and desktop scores are within 10% of each other.',
    );
  }, [setContextualHelpText]);

  const processData = (mobileSites, desktopSites, isLiveFilter) => {
    return mobileSites
      .filter(site => hasAudits(site) && site.isLive === isLiveFilter)
      .map((mobileSite, index) => {
        const desktopSite = desktopSites.find(ds => ds.baseURL === mobileSite.baseURL);
        return desktopSite ? {
          name: `${mobileSite.baseURL} (${index})`,
          desktopScore: Math.round(desktopSite.audits[0].auditResult.scores.performance * 100) - (0.001 * index),
          mobileScore: Math.round(mobileSite.audits[0].auditResult.scores.performance * 100) - (0.001 * index)
        } : null;
      })
      .filter(Boolean); // Filter out null values
  };

  const mobileSites = useMemo(() => sites['lhs-mobile'].filter(site => hasAudits(site)), [sites]);
  const desktopSites = useMemo(() => sites['lhs-desktop'].filter(site => hasAudits(site)), [sites]);

  const liveData = useMemo(() => processData(mobileSites, desktopSites, true), [mobileSites, desktopSites]);
  const notLiveData = useMemo(() => processData(mobileSites, desktopSites, false), [mobileSites, desktopSites]);


  return (
    <ResponsiveContainer width="100%" height={isFullScreen ? "100%" : 300}>
      <ScatterChart>
        <CartesianGrid/>
        <XAxis
          dataKey="mobileScore"
          domain={[0, 100]}
          name="Mobile Score"
          type="number"
          ticks={[0, 25, 50, 75, 100]}
          unit="%"
        >
          <Label value="Mobile Score" offset={40} position="insideLeft"/>
        </XAxis>
        <YAxis
          type="number"
          dataKey="desktopScore"
          name="Desktop Score"
          ticks={[0, 25, 50, 75, 100]}
          unit="%"
          domain={[0, 100]}
        >
          <Label value="Desktop Score" angle={-90} offset={70} position="insideBottom"/>
        </YAxis>
        <Tooltip content={<CustomTooltip/>}/>
        <Legend/>
        <ReferenceLine
          label="Equal Performance"
          segment={[{ x: 0, y: 0 }, { x: 100, y: 100 }]}
          stroke="red"
          strokeDasharray="3 3"
        />
        <ReferenceArea
          fill="green"
          fillOpacity={0.2}
          stroke="green"
          strokeOpacity={1}
          x1={0} x2={100} y1={90} y2={100}
        >
          <Label value="90% Area" position="insideLeft" offset={+10}/>
        </ReferenceArea>
        <ReferenceArea
          fill="green"
          fillOpacity={0.2}
          stroke="green"
          strokeOpacity={1}
          x1={90} x2={100} y1={0} y2={100}
        >
          <Label value="90% Area" position="insideBottom" offset={+10}/>
        </ReferenceArea>
        <Scatter
          data={liveData}
          fill="#8884d8"
          name="Live Sites"
          shape="cross"
          legendType="cross"
        />
        <Scatter
          data={notLiveData}
          fill="#82ca9d"
          name="Non-Live Sites"
          shape="triangle"
          legendType="triangle"
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

export default PerformanceScatterPlot;
