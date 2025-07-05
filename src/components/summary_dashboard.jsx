import React from "react";

export function SummaryDashboard({ history, threshold = 0.5 }) {
  if (history.length === 0) return null;

  const summary = {};

  history.forEach(({ scores }) => {
    Object.entries(scores).forEach(([label, value]) => {
      if (value >= threshold) {
        summary[label] = (summary[label] || 0) + 1;
      }
    });
  });

  const total = Object.values(summary).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white rounded-xl p-4 shadow-md">
      <h2 className="text-lg font-semibold mb-2">Session Summary</h2>
      {Object.entries(summary).map(([label, count]) => {
        const percent = ((count / total) * 100).toFixed(1);
        return (
          <div key={label} className="mb-2">
            <div className="text-sm font-medium">{label} ({percent}%)</div>
            <div className="w-full bg-gray-200 h-3 rounded">
              <div
                className="bg-green-500 h-3 rounded"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}