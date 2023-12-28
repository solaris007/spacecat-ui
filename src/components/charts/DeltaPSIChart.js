import React, { useEffect, useMemo, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { hasAudits } from '../../utils/siteUtils';
import { formatPercent, formatSeconds } from '../../utils/utils';
import { hasText } from '@adobe/spacecat-shared-utils';

function DeltaPSIChart({
                         sites,
                         setContextualHelpText,
                         setPickerOptions,
                         setDefaultPickerOption,
                         pickerSelection,
                         isFullScreen,
                       }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    setContextualHelpText(
      'This chart shows the delta between the previous and current PSI score for each site.' +
      ' The delta is calculated by subtracting the previous score from the current score.' +
      ' Use the options picker to select which PSI score to use for the chart.'
    );

    setPickerOptions([
      { key: 'performance', label: 'Performance' },
      { key: 'totalBlockingTime', label: 'Total Blocking Time' },
      { key: 'seo', label: 'SEO' },
      { key: 'accessibility', label: 'Accessibility' },
      { key: 'best-practices', label: 'Best Practices' },
    ]);

    setDefaultPickerOption('performance');
  }, [setContextualHelpText, setPickerOptions, setDefaultPickerOption]);

  const processData = (sites) => {
    const key = hasText(pickerSelection) ? pickerSelection : 'performance';

    const calculateValues = (site, index) => {
      let current = site.audits[0].auditResult?.scores[key];
      let previous = site.audits[0].previousAuditResult?.scores[key];

      if (key === 'totalBlockingTime') {
        current = site.audits[0].auditResult?.totalBlockingTime / 1000;
        previous = site.audits[0].previousAuditResult?.totalBlockingTime / 1000;
      }

      const delta = current - previous;

      return {
        baseURL: site.baseURL,
        current,
        delta,
        index,
        previous,
      }
    }

    return sites.filter(hasAudits).map(calculateValues);
  };

  useEffect(() => {
    setChartData(processData(sites));
  }, [sites, pickerSelection]);

  return (
    <ResponsiveContainer width="100%" height={isFullScreen ? "100%" : 300}>
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis dataKey="index"/>
        <YAxis yAxisId="left" domain={[0, 1]} tickFormatter={(value) => value.toFixed(2)}/>
        <YAxis yAxisId="right" orientation="right" domain={[-1, 1]} tickFormatter={(value) => value.toFixed(2)}/>
        <Tooltip formatter={(value, name) => [
          pickerSelection === 'totalBlockingTime' ? `${value.toFixed(2)}s` : formatPercent(value),
          name
        ]}/>
        <Legend/>
        <Line dot={false} type="monotone" dataKey="previous" stroke="#8884d8" yAxisId="left"/>
        <Line dot={false} type="monotone" dataKey="current" stroke="#82ca9d" yAxisId="left"/>
        <Line dot={false} type="monotone" dataKey="delta" stroke="#ff7300" yAxisId="right"/>
      </LineChart>
    </ResponsiveContainer>
  );
}

export default DeltaPSIChart;
