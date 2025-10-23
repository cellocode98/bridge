// src/components/HoursPieChart.tsx
"use client";

import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  data: { cause: string; hours: number }[];
}

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

const HoursPieChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="w-full h-48">
            <ResponsiveContainer width="100%" height={180}>
        <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <Pie
            dataKey="hours"
            nameKey="cause"
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={70}
            innerRadius={30} // donut chart
            fill="#8884d8"
            label={false} // remove slice labels
            >
            {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
            </Pie>
            <Tooltip formatter={(value: number) => `${value} hrs`} />
            <Legend verticalAlign="bottom" height={5} />
        </PieChart>
        </ResponsiveContainer>
    </div>
  );
};

export default HoursPieChart;
