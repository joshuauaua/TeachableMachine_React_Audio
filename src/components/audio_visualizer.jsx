import React from "react";

export default function AudioVisualizer({ scores, labels }) {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Live Audio Classification</h2>

      <div className="space-y-2">
        {labels.map((label) => (
          <div key={label}>
            <div className="text-sm font-medium">{label}</div>
            <div className="w-full bg-gray-200 rounded">
              <div
                className="bg-green-500 h-3 rounded"
                style={{ width: `${(scores[label] || 0) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-600">
              {((scores[label] || 0) * 100).toFixed(1)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}