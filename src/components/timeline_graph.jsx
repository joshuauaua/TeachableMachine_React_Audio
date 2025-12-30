import React from "react";


import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  ZAxis,
} from "recharts";

export default function TimelineGraph({ activations }) {
  const displayData = [];

  activations.forEach(({ timestamp, label }) => {
    displayData.push({
      timestamp: timestamp,
      label: label,
    });
  });

  return (
    <div className="w-full h-full flex items-center justify-center p-2">
      <ResponsiveContainer width="100%" height={250}>
        <ScatterChart margin={{ top: 20, right: 30, bottom: 10, left: 0 }}>
          <XAxis
            dataKey="timestamp"
            name="Time"
            type="number"
            tickFormatter={(t) => `${(t / 1000).toFixed(1)}s`}
            domain={["auto", "auto"]}
            stroke="#9ca3af" 
            tick={{ fill: '#9ca3af' }}
          />
          <YAxis
            type="category"
            dataKey="label"
            name="Class"
            allowDuplicatedCategory={false}
            stroke="#9ca3af"
            tick={{ fill: '#9ca3af' }}
            width={80}
          />
          <Tooltip 
            cursor={{ strokeDasharray: "3 3", stroke: '#4b5563' }}
            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem', color: '#f3f4f6' }}
            itemStyle={{ color: '#f3f4f6' }}
            labelStyle={{ color: '#9ca3af' }}
          />
          <Scatter data={displayData} fill="#60a5fa" shape="circle" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}