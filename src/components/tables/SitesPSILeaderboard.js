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

function calculatePSIMetric (site, metric) {
  const current = site.audits[0].auditResult.scores;
  const previous = site.audits[0].previousAuditResult.scores;
  return {
    current: current[metric],
    delta: current[metric] - previous[metric],
    percentChange: ((current[metric] - previous[metric]) / previous[metric]) * 100,
    previous: previous[metric],
  }
}

function calculateLeaderboardScores(sites, showWinners) {
  // Calculate Min and Max TBT for normalization
  const tbtValues = sites.map(site => site.audits[0].auditResult.totalBlockingTime || 0);
  const minTBT = Math.min(...tbtValues);
  const maxTBT = Math.max(...tbtValues);

  const calculateMetrics = (site) => {
    const metrics = ['performance', 'seo', 'accessibility', 'best-practices'].reduce((metrics, metric) => {
      metrics[metric] = calculatePSIMetric(site, metric);
      return metrics;
    }, {});

    const currentTotalBlockingTime = site.audits[0].auditResult.totalBlockingTime || 0;
    const previousTotalBlockingTime = site.audits[0].previousAuditResult.totalBlockingTime || 0;
    let normalizedTBT;

    // Check if Max TBT is not equal to Min TBT to avoid division by zero
    if (maxTBT !== minTBT) {
      normalizedTBT = (currentTotalBlockingTime - minTBT) / (maxTBT - minTBT);
      normalizedTBT = 1 - normalizedTBT; // Invert the normalization
      normalizedTBT = Math.max(0, Math.min(normalizedTBT, 1)); // Clamp between 0 and 1
    } else {
      normalizedTBT = currentTotalBlockingTime === minTBT ? 1 : 0; // Handle the case where all TBTs are the same
    }

    metrics.totalBlockingTime = {
      current: currentTotalBlockingTime,
      normalizedScore: normalizedTBT,
      delta: currentTotalBlockingTime - previousTotalBlockingTime,
      percentChange: (((currentTotalBlockingTime - previousTotalBlockingTime) / previousTotalBlockingTime) * 100) || 0,
      previous: previousTotalBlockingTime,
    };

    const weights = { performance: 1.4, totalBlockingTime: 1.2, seo: 1.1, accessibility: 1, 'best-practices': 1 };

    metrics.totalScore = Object.keys(metrics).reduce((total, key) => {
      const score = key === 'totalBlockingTime' ? metrics[key].normalizedScore * weights[key] : metrics[key].delta * weights[key];
      return total + score;
    }, 0);

    return metrics;
  };

  return sites
    .filter(site => isObject(site.audits[0].auditResult?.scores) && isObject(site.audits[0].previousAuditResult?.scores))
    .map((site, index) => ({
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
                <Text>({formatSigned(site.metrics.totalBlockingTime.delta/1000, 2)})</Text>
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
  );
}

export default SitesPSILeaderboard;
