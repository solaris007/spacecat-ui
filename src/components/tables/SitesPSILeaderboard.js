import {
  ActionButton,
  Cell,
  Column,
  Flex,
  Row,
  TableBody,
  TableHeader,
  TableView,
  Text,
  View,
} from '@adobe/react-spectrum';
import {
  Bar,
  BarChart, Brush,
  CartesianGrid,
  Legend, ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { isObject } from '@adobe/spacecat-shared-utils';
import Algorithm from '@spectrum-icons/workflow/Algorithm';
import React, { useEffect, useState } from 'react';

import { formatPercent, formatSeconds, formatSigned, renderExternalLink } from '../../utils/utils';

import PercentChangeBadge from '../content/PercentChangeBadge';
import SiteRowActions from './actions/SiteRowActions';

const SCORE_WEIGHTS = { performance: 1.4, totalBlockingTime: 1, seo: 1.1, accessibility: 1, 'best-practices': 1 };

/**
 * Calculates the metric score for a given site and metric.
 *
 * @param {Object} site - The site object containing audit results.
 * @param {string} metric - The name of the metric to calculate (e.g., 'performance', 'seo').
 * @returns {Object} An object containing the current metric score, the delta from the previous score,
 * the percentage change, the previous score, and the weighted score based on predefined weights.
 *
 * @example
 * // Returns metric information for the 'performance' metric of a site
 * calculatePSIMetric(site, 'performance');
 */
function calculatePSIMetric(site, metric) {
  const current = site.audits[0].auditResult.scores;
  const previous = site.audits[0].previousAuditResult.scores;
  const delta = current[metric] - previous[metric];
  return {
    current: current[metric],
    delta,
    percentChange: (delta / previous[metric]) * 100,
    previous: previous[metric],
    score: delta * SCORE_WEIGHTS[metric],
  }
}

/**
 * Normalizes a delta TBT value based on the maximum absolute delta TBT observed.
 *
 * @param {number} deltaTBT - The delta TBT value to normalize.
 * @param {number} minDeltaTBT - The minimum delta TBT observed in the dataset.
 * @param {number} maxDeltaTBT - The maximum delta TBT observed in the dataset.
 * @returns {number} The normalized delta TBT value.
 *
 * @example
 * // Normalizes a delta TBT value of 100 ms
 * normalizeDeltaTBT(100, -200, 300);
 */

function normalizeDeltaTBT(deltaTBT, minDeltaTBT, maxDeltaTBT) {
  const maxAbsDelta = Math.max(Math.abs(minDeltaTBT), Math.abs(maxDeltaTBT));
  if (maxAbsDelta === 0) {
    return 0; // Avoid division by zero if there's no variation in delta TBT
  }
  return deltaTBT / maxAbsDelta;
}

/**
 * Calculates the Total Blocking Time (TBT) metric for a given site, applying a logarithmic scoring algorithm.
 * This function first calculates the delta TBT (the difference between current and previous TBT values),
 * then normalizes this delta value based on the observed range across all sites. The normalized delta TBT
 * is used to calculate a score that reflects the performance change.
 *
 * This score calculation is logarithmic in nature,
 * meaning small changes in TBT result in smaller score changes, and larger TBT changes result in disproportionately
 * larger score changes. This emphasizes significant performance variations. The final score is also weighted
 * by a predefined factor for TBT to adjust its impact relative to other metrics.
 *
 * @param {Object} site - The site object containing TBT data in its audit results.
 * @param {number} minDeltaTBT - The minimum delta TBT observed across all sites.
 * @param {number} maxDeltaTBT - The maximum delta TBT observed across all sites.
 * @returns {Object} An object containing the current TBT, normalized delta TBT, raw delta TBT,
 * percentage change in TBT, previous TBT, and the weighted score based on predefined weights.
 *
 * @example
 * // Returns TBT metric information for a site
 * calculateTBTMetric(site, -200, 300);
 */
function calculateTBTMetric(site, minDeltaTBT, maxDeltaTBT) {
  const currentTBT = site.audits[0].auditResult.totalBlockingTime || 0;
  const previousTBT = site.audits[0].previousAuditResult.totalBlockingTime || 0;
  const deltaTBT = currentTBT - previousTBT;

  let normalizedDeltaTBT = normalizeDeltaTBT(deltaTBT, minDeltaTBT, maxDeltaTBT);

  // Logarithmic Score Calculation
  let score;
  if (normalizedDeltaTBT === 0) {
    score = 0;
  } else {
    score = -Math.sign(normalizedDeltaTBT) * Math.pow(Math.abs(normalizedDeltaTBT), 2);
  }
  return {
    current: currentTBT,
    deltaNormalized: normalizedDeltaTBT,
    delta: deltaTBT,
    percentChange: ((deltaTBT / previousTBT) * 100) || 0,
    previous: previousTBT,
    score: score * SCORE_WEIGHTS.totalBlockingTime,
  };
}

/**
 * Processes an array of site objects to calculate and rank their scores based on various metrics including TBT.
 * Each site's score is calculated for multiple metrics (e.g., performance, SEO, accessibility), and these scores are
 * combined into a total score for each site. The TBT metric is specifically calculated using a logarithmic scoring method
 * that emphasizes significant changes in TBT. The total score for each site includes the weighted TBT score along with
 * scores for other metrics. The weighting factors for each metric can be adjusted to reflect their relative importance.
 * The final step in the process is to sort the sites based on their total scores. This can be done in descending order
 * (showing the 'winners' or best-performing sites first) or in ascending order, based on the 'showWinners' parameter.
 *
 * @param {Array} sites - An array of site objects to be scored and ranked.
 * @param {boolean} showWinners - Flag to determine sorting order. If true, higher scores are ranked first.
 * @returns {Array} A sorted array of site objects with calculated metrics, including individual metric scores and a total score.
 *
 * @example
 * // Returns a sorted list of sites with calculated metrics
 * calculateLeaderboardScores(sites, true);
 */
function calculateLeaderboardScores(sites, showWinners) {
  const deltaTBTValues = sites.map(site => {
    const currentTBT = site.audits[0].auditResult.totalBlockingTime || 0;
    const previousTBT = site.audits[0].previousAuditResult.totalBlockingTime || 0;
    return currentTBT - previousTBT;
  });

  const minDeltaTBT = Math.min(...deltaTBTValues);
  const maxDeltaTBT = Math.max(...deltaTBTValues);

  const calculateMetrics = (site) => {
    const metrics = ['performance', 'seo', 'accessibility', 'best-practices'].reduce((metrics, metric) => {
      metrics[metric] = calculatePSIMetric(site, metric);
      metrics.totalScore = (metrics.totalScore || 0) + metrics[metric].score;
      return metrics;
    }, {});

    metrics.totalBlockingTime = calculateTBTMetric(site, minDeltaTBT, maxDeltaTBT);
    metrics.totalScore += metrics.totalBlockingTime.score;

    return metrics;
  };

  return sites
    .filter(site => isObject(site.audits[0].auditResult?.scores) && isObject(site.audits[0].previousAuditResult?.scores))
    .map((site) => ({
      ...site,
      metrics: calculateMetrics(site)
    }))
    .sort((a, b) => {
      return showWinners ? b.metrics.totalScore - a.metrics.totalScore : a.metrics.totalScore - b.metrics.totalScore;
    });
}

function renderMetricsCell({ site, metric }) {
  return (
    <Cell>
      <Flex direction="row" alignItems="center" alignContent="center" gap="size-150">
        <PercentChangeBadge percentage={site.metrics[metric].percentChange} label={metric}/>
        <Text>{formatPercent(site.metrics[metric].previous)} -> {formatPercent(site.metrics[metric].current)}</Text>
        <Text>({formatSigned(site.metrics[metric].delta * 100)})</Text>
      </Flex>
    </Cell>
  )
}

function transformChartData(sites) {
  return sites.map((site, index) => ({
    siteName: site.baseURL,
    rank: index,
    performance: site.metrics.performance.score,
    seo: site.metrics.seo.score,
    accessibility: site.metrics.accessibility.score,
    bestPractices: site.metrics['best-practices'].score,
    totalBlockingTime: site.metrics.totalBlockingTime.score,
    totalScore: site.metrics.totalScore,
  }));
}

function SitesPSILeaderboard({ sites, showWinners, auditType, updateSites }) {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [showScoreChart, setShowScoreChart] = useState(false);

  function handleShowScoreChart() {
    setShowScoreChart(!showScoreChart);
  }

  useEffect(() => {
    const data = calculateLeaderboardScores(sites, showWinners);

    setLeaderboardData(data);
    setChartData(transformChartData(data));

    const columns = ['TOTAL', 'Perf        ', 'TBT             ', 'SEO         ', 'A11Y        ', 'BP          ', 'URL'];
    const keys = ['performance', 'totalBlockingTime', 'seo', 'accessibility', 'best-practices'];

    console.log(columns.join('\t'))
    data.map(site => console.log(
      site.metrics.totalScore.toFixed(3) + '\t'
      + keys.map(key => `${site.metrics[key].delta.toFixed(3)} [${site.metrics[key].score.toFixed(3)}]`).join('\t')
      + '\t' + site.baseURL
    ));

  }, [sites, showWinners]);

  return (
    <View>
      <TableView aria-label={showWinners ? "Winners" : "Losers"} height="size-3600">
        <TableHeader>
          <Column key="site" width="1.3fr">
            <Flex direction="row" alignItems="center" gap="size-150">
              <Text>Site</Text>
              <ActionButton onPress={handleShowScoreChart} aria-label="Debug Chart">
                <Algorithm size="XS"/>
              </ActionButton>
            </Flex>
          </Column>
          <Column key="delta-performance" width="1fr">Perf</Column>
          <Column key="delta-tbt" width="1fr">TBT</Column>
          <Column key="delta-seo" width="1fr">SEO</Column>
          <Column key="delta-accessibility" width="1fr">A11Y</Column>
          <Column key="delta-best-practices" width="1fr">BP</Column>
          <Column key="actions" width="0.2fr">&nbsp;</Column>
        </TableHeader>
        <TableBody>
          {leaderboardData.map((site, index) => (
            <Row key={index}>
              <Cell>
                <Flex direction="row" alignItems="center" alignContent="center" gap="size-150">
                  <Text>{index + 1}. ({site.metrics.totalScore.toFixed(2)})</Text>
                  <Text>{renderExternalLink(site.baseURL)}</Text>
                </Flex>
              </Cell>
              {renderMetricsCell({ site, metric: 'performance' })}
              <Cell>
                <Flex direction="row" alignItems="center" gap="size-150">
                  <PercentChangeBadge
                    percentage={site.metrics.totalBlockingTime.percentChange}
                    reverse={true}
                    label="totalBlockingTime"
                  />
                  <Text>{formatSeconds(site.metrics.totalBlockingTime.previous)} -> {formatSeconds(site.metrics.totalBlockingTime.current)}</Text>
                  <Text>({formatSigned(site.metrics.totalBlockingTime.delta / 1000, 2)})</Text>
                </Flex>
              </Cell>
              {renderMetricsCell({ site, metric: 'seo' })}
              {renderMetricsCell({ site, metric: 'accessibility' })}
              {renderMetricsCell({ site, metric: 'best-practices' })}
              <Cell>
                <SiteRowActions
                  site={site}
                  auditType={auditType}
                  audit={site.audits[0]}
                  updateSites={updateSites}
                />
              </Cell>
            </Row>
          ))}
        </TableBody>
      </TableView>
      {showScoreChart &&
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            stackOffset="sign"
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="rank"/>
            <YAxis domain={[-1, 1]}/>
            <Tooltip
              contentStyle={{ backgroundColor: '#292929', color: 'white' }}
              formatter={(value, name) => {
                return [value.toFixed(3), name]
              }}
              labelFormatter={(value, payload) => {
                return `Score: ${payload[0]?.payload?.totalScore.toFixed(3)} for ${payload[0]?.payload.siteName}`
              }}
            />
            <Legend/>
            <ReferenceLine y={0} stroke="#ff0000" />
            <Brush dataKey="rank" height={30} stroke="#8884d8" />
            <Bar dataKey="totalBlockingTime" stackId="a" fill="#ffdd99"/>
            <Bar dataKey="performance" stackId="a" fill="#8884d8"/>
            <Bar dataKey="seo" stackId="a" fill="#82ca9d"/>
            <Bar dataKey="accessibility" stackId="a" fill="#ffc658"/>
            <Bar dataKey="bestPractices" stackId="a" fill="#ff8042"/>
          </BarChart>
        </ResponsiveContainer>
      }
    </View>
  );
}

export default SitesPSILeaderboard;
