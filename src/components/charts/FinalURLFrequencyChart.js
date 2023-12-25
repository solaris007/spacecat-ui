import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import React from 'react';

const FinalURLFrequencyChart = ({ data }) => {
  const barData = Object.entries(data).map(([url, count]) => ({ url, count }));

  return (
    <BarChart width={600} height={300} data={barData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="url" />
      <YAxis />
      <Tooltip contentStyle={{ backgroundColor: '#292929', color: 'white' }}/>
      <Legend />
      <Bar dataKey="count" fill="#8884d8" />
    </BarChart>
  );
};

export default FinalURLFrequencyChart;
