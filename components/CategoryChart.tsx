import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { InventoryItem } from '../types';

interface CategoryChartProps {
  data: InventoryItem[];
}

const CategoryChart: React.FC<CategoryChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    const categoryTotals = data.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.totalValue;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryTotals)
      .map(([name, totalValue]) => ({ name, totalValue }))
      .sort((a, b) => b.totalValue - a.totalValue);
  }, [data]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-accent p-2 border border-gray-600 rounded-md shadow-lg">
          <p className="font-bold text-text-primary">{label}</p>
          <p className="text-accent-gold">{`Total Value: Ksh ${payload[0].value.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer>
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 20,
            left: 30,
            bottom: 5,
          }}
          barSize={20}
        >
          <XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} tick={{ fill: '#D1C49D' }} />
          <YAxis tickFormatter={(value) => `Ksh ${Number(value) / 1000}k`} tick={{ fill: '#D1C49D' }} />
          <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(115, 65, 139, 0.5)'}} />
          <Legend wrapperStyle={{ color: '#F3E5AB' }}/>
          <CartesianGrid strokeDasharray="3 3" stroke="#5F2777" />
          <Bar dataKey="totalValue" fill="#D4AF37" background={{ fill: '#4A0E63' }} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryChart;