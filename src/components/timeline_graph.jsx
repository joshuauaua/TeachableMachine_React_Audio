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
    <div className="p-4">
      <h2>Timeline</h2>
      <ResponsiveContainer width="60%" height={300}>
        <ScatterChart margin={{ top: 20, right: 30, bottom: 10, left: 10 }}>
          <XAxis
            dataKey="timestamp"
            name="Time"
            type="number"
            tickFormatter={(t) => `${(t / 1000).toFixed(1)}s`}
            domain={["auto", "auto"]}
          />
          <YAxis
            type="category"
            dataKey="label"
            name="Class"
            allowDuplicatedCategory={false}
          />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter data={displayData} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}