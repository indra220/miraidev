'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

interface ActivityData {
  name: string;
  visitors: number;
}

export default function ActivityChart({ data }: { data: ActivityData[] }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
        <XAxis 
          dataKey="name" 
          stroke="#9CA3AF" 
          fontSize={12} 
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          stroke="#9CA3AF" 
          fontSize={12} 
          tickLine={false}
          axisLine={false}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1f2937', 
            borderColor: '#374151', 
            borderRadius: '0.5rem',
            color: 'white'
          }} 
          itemStyle={{ color: 'white' }}
          labelStyle={{ color: '#d1d5db', fontWeight: 'bold' }}
        />
        <Legend />
        <Bar 
          dataKey="visitors" 
          name="Pengunjung" 
          fill="url(#colorUv)" 
          radius={[4, 4, 0, 0]} 
        />
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  );
}