
import React from "react";

export function SummaryDashboard({ history = [], threshold = 0.5 }) {
  if (!Array.isArray(history) || history.length === 0) return null;

  const summary = {};

  history.forEach(({ scores }) => {
    if (!scores) return;
    Object.entries(scores).forEach(([label, value]) => {
      if (value >= threshold) {
        summary[label] = (summary[label] || 0) + 1;
      }
    });
  });

  const total = Object.values(summary).reduce((a, b) => a + b, 0);

  return (
    <div>
      <h2>Session Summary</h2>
      {Object.entries(summary).map(([label, count]) => {
        const percent = ((count / total) * 100).toFixed(1);
        return (
          <div key={label}>
            <div>{label} ({percent}%)</div>
            <div style={{ background: "#ccc", height: "8px", width: "100%" }}>
              <div
                style={{ width: `${percent}%`, background: "#4a90e2", height: "100%" }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
