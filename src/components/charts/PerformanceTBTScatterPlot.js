import React, { useEffect, useMemo } from 'react';
import {
  CartesianGrid,
  Label,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { hasAudits } from '../../utils/siteUtils';
import { formatPercent, formatSeconds } from '../../utils/utils';
import { isObject } from '@adobe/spacecat-shared-utils';

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
        <p><strong>Performance:</strong> {data.performance.toFixed(2)}%</p>
        <p><strong>TBT:</strong> {data.totalBlockingTime.toFixed(3)}s</p>
      </div>
    );
  }

  return null;
};

function PerformanceTBTScatterPlot({ sites, setContextualHelpText, isFullScreen }) {
  useEffect(() => {
    setContextualHelpText(
      'This chart plots total blocking time (TBT) against performance scores for each site. ' +
      'The x-axis represents the performance score, and the y-axis represents the total blocking time. '
    );
  }, [setContextualHelpText]);

  const processData = (sites) => {
    const data = {
      currentData: [],
      previousData: [],
    };

    sites.forEach((site, index) => {
      if (!hasAudits(site)) {
        return;
      }
      data.currentData.push({
        name: `${site.baseURL} (Current ${index})`,
        performance: Math.round(site.audits[0].auditResult.scores.performance * 100) - (0.001 * index),
        totalBlockingTime: site.audits[0].auditResult.totalBlockingTime / 1000 || 0,
      });

      if (isObject(site.audits[0].previousAuditResult?.scores)) {
        data.previousData.push({
          name: `${site.baseURL} (Previous ${index})`,
          performance: Math.round(site.audits[0].previousAuditResult.scores.performance * 100) - (0.001 * index),
          totalBlockingTime: site.audits[0].previousAuditResult.totalBlockingTime / 1000 || 0,
        });
      }
    });

    return data;
  };

  const siteData = useMemo(() => processData(sites), [sites]);

  return (
    <ResponsiveContainer width="100%" height={isFullScreen ? "100%" : 300}>
      <ScatterChart>
        <CartesianGrid/>
        <XAxis
          dataKey="performance"
          domain={[0, 100]}
          name="Performance"
          type="number"
          ticks={[0, 25, 50, 75, 100]}
          unit="%"
        >
          <Label value="Performance" offset={40} position="insideLeft"/>
        </XAxis>
        <YAxis
          type="number"
          dataKey="totalBlockingTime"
          name="Total Blocking TIme"
          unit="s"
        >
          <Label value="Total Blocking Time" angle={-90} offset={70} position="insideBottom"/>
        </YAxis>
        <Tooltip content={<CustomTooltip/>}/>
        <Legend/>
        <Scatter
          data={siteData.currentData}
          fill="#a25ef6"
          name="TBT Latest"
          shape="cross"
          legendType="cross"
        />
        <Scatter
          data={siteData.previousData}
          fill="#00928c"
          name="TBT Previous"
          shape="triangle"
          legendType="triangle"
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

export default PerformanceTBTScatterPlot;
