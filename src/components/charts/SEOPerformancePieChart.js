import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import React from 'react';

const SEOPerformancePieChart = ({ data }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28']; // blue, green, yellow
  const pieData = [
    { name: 'High', value: data.high },
    { name: 'Medium', value: data.medium },
    { name: 'Low', value: data.low }
  ];

  return (
    <PieChart width={300} height={250}>
      <Pie
        data={pieData}
        cx={150}
        cy={100}
        labelLine={false}
        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        outerRadius={70}
        fill="#8884d8"
        dataKey="value"
      >
        {pieData.map((entry, index) => (
          <Cell key={`seo-cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip contentStyle={{ backgroundColor: '#292929', color: 'white' }}/>
      <Legend />
    </PieChart>
  );
};

export default SEOPerformancePieChart;
