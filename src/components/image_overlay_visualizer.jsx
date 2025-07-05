import React from "react";

const classToPosition = {
  "Front Left": { top: "30%", left: "25%" },
  "Front Right": { top: "30%", left: "75%" },
  "Back Left": { top: "70%", left: "25%" },
  "Back Right": { top: "70%", left: "75%" },
};

export default function ImageOverlayVisualizer({ scores }) {
  return (
    <div className="relative w-full max-w-md mx-auto">
      <img
        src="/overlayimg.png" 
        alt="Car top-down"
        className="w-full rounded"
      />

      {Object.entries(classToPosition).map(([label, style]) => {
        const isActive = (scores[label] || 0) > 0.5;

        return (
          <div
            key={label}
            className={`absolute w-4 h-4 rounded-full transition-all duration-300 ${
              isActive ? "bg-green-500" : "bg-gray-400"
            }`}
            style={{ ...style, transform: "translate(-50%, -50%)" }}
            title={label}
          ></div>
        );
      })}
    </div>
  );
}