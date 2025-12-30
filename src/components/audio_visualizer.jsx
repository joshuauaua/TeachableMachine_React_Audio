export default function AudioVisualizer({ scores, labels }) {
  return (
    <div className="w-full">
      <div className="space-y-3">
        {labels.map((label) => (
          <div key={label} className="w-full">
            <div className="flex justify-between items-center mb-1">
                <div className="text-sm font-medium text-gray-300">{label}</div>
                <div className="text-xs text-gray-400 font-mono">
                {((scores[label] || 0) * 100).toFixed(1)}%
                </div>
            </div>
            
            <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${(scores[label] || 0) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}