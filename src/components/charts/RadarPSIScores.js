import { Legend, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from 'recharts';
import React from 'react';

const transformScoresToRadarData = (scores) => {
  return ['performance', 'seo', 'accessibility', 'best-practices'].map((key) => ({
    subject: key,
    A: scores[key],
    fullMark: 1,
  }));
}

function RadarPSIScores({ auditResult }) {
  const scoresRadarData = transformScoresToRadarData(auditResult.scores);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart
        cx="50%"
        cy="50%"
        outerRadius="80%"
        data={scoresRadarData}
      >
        <PolarGrid/>
        <PolarAngleAxis dataKey="subject"/>
        <PolarRadiusAxis orientation="middle" />
        <Radar
          name="PSI Scores"
          dataKey="A"
          dot={true}
          stroke="magenta"
          fill="gray"
          fillOpacity={0.6}
        />
        <Legend/>
      </RadarChart>
    </ResponsiveContainer>
  );
}

export default RadarPSIScores;
