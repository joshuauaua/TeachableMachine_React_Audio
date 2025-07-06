
import React from "react";

export function RadialClassDistribution({ classScores }) {
  if (!classScores || typeof classScores !== 'object') return null;

  const labels = Object.keys(classScores);

  return (
    <div>
      <h2>Radial Class Distribution</h2>
      <div style={{ position: "relative", width: "200px", height: "200px" }}>
        {labels.map((label, i) => {
          const angle = (i / labels.length) * 2 * Math.PI;
          const radius = classScores[label] * 100;
          const x = 100 + radius * Math.cos(angle);
          const y = 100 + radius * Math.sin(angle);

          return (
            <div
              key={label}
              className="absolute flex items-center justify-center text-xs font-medium bg-blue-500 text-white rounded-full"
              style={{
                width: "24px",
                height: "24px",
                left: `${x}px`,
                top: `${y}px`,
                transform: "translate(-50%, -50%)",
                position: "absolute",
              }}
            >
              {label[0]}
            </div>
          );
        })}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-black rounded-full" />
      </div>
    </div>
  );
}
