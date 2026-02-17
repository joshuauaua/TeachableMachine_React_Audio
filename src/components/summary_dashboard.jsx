import React from "react";
import { BarChart } from '@mui/x-charts/BarChart';
import ScatterHistory from "./ScatterHistory";
import ScatterCorrelation from "./ScatterCorrelation";
import "./audio_visualizer.css";

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
  
  // Transform to dataset for MUI Charts
  const chartData = Object.entries(summary).map(([label, count]) => ({
      label: label,
      count: count,
      percent: parseFloat(((count / total) * 100).toFixed(1))
  }));

  return (
    <div className="flex flex-col gap-8 w-full">
        {/* Bar Chart Section */}
        <div className="bg-white rounded-xl p-6 shadow-md w-full">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Class Distribution</h2>
        
        {chartData.length > 0 ? (
            <div className="w-full h-[350px]">
                <BarChart
                    dataset={chartData}
                    xAxis={[{ 
                        scaleType: 'band', 
                        dataKey: 'label',
                        tickLabelStyle: {
                            angle: 0,
                            textAnchor: 'middle',
                            fontSize: 12
                        }
                    }]}
                    series={[{ 
                        dataKey: 'count', 
                        label: 'Detections',
                        color: '#3b82f6', // blue-500
                        valueFormatter: (value) => `${value} detections`
                    }]}
                    yAxis={[{ label: 'Count' }]}
                    height={300}
                    margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                    slotProps={{
                        legend: { hidden: false }
                    }}
                />
            </div>
        ) : (
            <p className="text-gray-500 italic">No detections above threshold yet.</p>
        )}
        
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {chartData.map((item) => (
                <div key={item.label} className="bg-gray-100 p-3 rounded-lg text-center">
                    <div className="font-semibold text-gray-700">{item.label}</div>
                    <div className="text-2xl font-bold text-blue-600">{item.percent}%</div>
                    <div className="text-xs text-gray-500">{item.count} detections</div>
                </div>
            ))}
        </div>
        </div>

        {/* Scatter Chart Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ScatterHistory history={history} />
            <ScatterCorrelation history={history} />
        </div>
    </div>
  );
}