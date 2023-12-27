import React, { useEffect, useState } from 'react';
import {
  Cell,
  Column, Flex,
  Row,
  TableBody,
  TableHeader,
  TableView,
  Text,
} from '@adobe/react-spectrum';
import SiteRowActions from './actions/SiteRowActions';
import { isObject } from '@adobe/spacecat-shared-utils';
import PercentChangeBadge from '../content/PercentChangeBadge';
import { formatPercent, formatSeconds, formatSigned, renderExternalLink } from '../../utils/utils';

function calculateLeaderboardScores(sites, showWinners) {
  const TBT_ACCEPTABLE_LIMIT = 200; // 200ms acceptable limit
  const TBT_MAX_CONSIDERED = 10000; // Example: 10 seconds as a maximum value for consideration

  const calculateMetrics = (site) => {
    const current = site.audits[0].auditResult.scores;
    current.totalBlockingTime = site.audits[0].auditResult.totalBlockingTime;

    const previous = site.audits[0].previousAuditResult.scores;
    previous.totalBlockingTime = site.audits[0].previousAuditResult.totalBlockingTime;

    // Calculate deltas and percent changes
    const metrics = {
      performance: {
        current: current.performance,
        delta: current.performance - previous.performance,
        percentChange: ((current.performance - previous.performance) / previous.performance) * 100,
        previous: previous.performance
      },
      totalBlockingTime: {
        current: current.totalBlockingTime,
        delta: previous.totalBlockingTime - current.totalBlockingTime,
        percentChange: ((previous.totalBlockingTime - current.totalBlockingTime) / previous.totalBlockingTime) * 100,
        normalizedScore: Math.max(0, (TBT_MAX_CONSIDERED - Math.min(current.totalBlockingTime, TBT_MAX_CONSIDERED)) / (TBT_MAX_CONSIDERED - TBT_ACCEPTABLE_LIMIT)),
        previous: previous.totalBlockingTime
      },
      seo: {
        current: current.seo,
        delta: current.seo - previous.seo,
        percentChange: ((current.seo - previous.seo) / previous.seo) * 100,
        previous: previous.seo
      },
      accessibility: {
        current: current.accessibility,
        delta: current.accessibility - previous.accessibility,
        percentChange: ((current.accessibility - previous.accessibility) / previous.accessibility) * 100,
        previous: previous.accessibility
      },
      bestPractices: {
        current: current['best-practices'],
        delta: current['best-practices'] - previous['best-practices'],
        percentChange: ((current['best-practices'] - previous['best-practices']) / previous['best-practices']) * 100,
        previous: previous['best-practices']
      }
    };

    // Adjusting weights
    const weights = { performance: 0.4, totalBlockingTime: 0.3, seo: 0.2, accessibility: 0.15, bestPractices: 0.15 };

    // Calculate weighted total score
    metrics.totalScore = Object.keys(metrics).reduce((total, key) => {
      // Use normalizedScore for TBT
      const score = key === 'totalBlockingTime' ? metrics[key].normalizedScore * weights[key] : metrics[key].delta * weights[key];
      return total + score;
    }, 0);

    return metrics;
  };

  return sites
    .filter(site => isObject(site.audits[0].auditResult?.scores) && isObject(site.audits[0].previousAuditResult?.scores))
    .map(site => ({
      ...site,
      metrics: calculateMetrics(site)
    }))
    .sort((a, b) => {
      // Sort by totalScore. If showWinners is true, sort descending (winners), otherwise ascending (losers)
      return showWinners ? b.metrics.totalScore - a.metrics.totalScore : a.metrics.totalScore - b.metrics.totalScore;
    })
}

function SitesPSILeaderboard({ sites, showWinners, auditType, updateSites }) {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    const data = calculateLeaderboardScores(sites, showWinners);
    setLeaderboardData(data);
  }, [sites, showWinners]);

  return (
    <TableView aria-label={showWinners ? "Winners" : "Losers"} height="size-3600">
      <TableHeader>
        <Column key="site" width="1.3fr">Site</Column>
        <Column key="score" width="0.3fr">Score</Column>
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
            <Cell>{renderExternalLink(site.baseURL)}</Cell>
            <Cell>{site.metrics.totalScore.toFixed(2)}</Cell>
            <Cell>
              <Flex direction="row" alignItems="center" alignContent="center" gap="size-150">
                <PercentChangeBadge percentage={site.metrics.performance.percentChange} label="performance"/>
                <Text>{formatPercent(site.metrics.performance.previous)} -> {formatPercent(site.metrics.performance.current)}</Text>
                <Text>({formatSigned(site.metrics.performance.delta * 100)})</Text>
              </Flex>
            </Cell>
            <Cell>
              <Flex direction="row" alignItems="center" gap="size-150">
                <PercentChangeBadge
                  percentage={site.metrics.totalBlockingTime.percentChange * -1}
                  reverse={true}
                  label="totalBlockingTime"
                />
                <Text>{formatSeconds(site.metrics.totalBlockingTime.previous)} -> {formatSeconds(site.metrics.totalBlockingTime.current)}</Text>
              </Flex>
            </Cell>
            <Cell>
              <Flex direction="row" alignItems="center" gap="size-150">
                <PercentChangeBadge percentage={site.metrics.seo.percentChange} label="seo"/>
                <Text>{formatPercent(site.metrics.seo.previous)} -> {formatPercent(site.metrics.seo.current)}</Text>
              </Flex>
            </Cell>
            <Cell>
              <Flex direction="row" alignItems="center" gap="size-150">
                <PercentChangeBadge percentage={site.metrics.accessibility.percentChange} label="accessibility"/>
                <Text>{formatPercent(site.metrics.accessibility.previous)} -> {formatPercent(site.metrics.accessibility.current)}</Text>
              </Flex>
            </Cell>
            <Cell>
              <Flex direction="row" alignItems="center" gap="size-150">
                <PercentChangeBadge percentage={site.metrics.bestPractices.percentChange} label="bestPractices"/>
                <Text>{formatPercent(site.metrics.bestPractices.previous)} -> {formatPercent(site.metrics.bestPractices.current)}</Text>
              </Flex>
            </Cell>
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
  );
}

export default SitesPSILeaderboard;
