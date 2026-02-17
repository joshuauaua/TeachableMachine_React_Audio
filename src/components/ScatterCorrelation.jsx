import React from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

export default function ScatterCorrelation({ history }) {
  if (!history || history.length < 2) return null;

  // 1. Identify the top 2 most frequent classes
  const counts = {};
  history.forEach(({ scores }) => {
      // Consider a class "present" if score > 0.1? Or just sum scores?
      // Let's sum scores to find "dominance"
      Object.entries(scores).forEach(([label, score]) => {
          counts[label] = (counts[label] || 0) + score;
      });
  });

  const sortedLabels = Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .map(([label]) => label);

  if (sortedLabels.length < 2) {
      return (
        <Stack width="100%" spacing={2} sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="body2" color="text.secondary">
                Need at least 2 detected classes to show correlation.
            </Typography>
        </Stack>
      );
  }

  const labelA = sortedLabels[0];
  const labelB = sortedLabels[1];

  // 2. Build dataset
  // We want to see how Class A score correlates with Class B score frames.
  const dataset = history.map((item, index) => ({
      id: index,
      x: item.scores[labelA] || 0,
      y: item.scores[labelB] || 0,
  }));

  return (
    <Stack width="100%" spacing={2} sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h6" component="div">
        Class Correlation: {labelA} vs {labelB}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Comparing confidence scores of the top 2 classes.
      </Typography>
      
      <ScatterChart
        height={300}
        dataset={dataset}
        series={[
            {
                label: `${labelA} vs ${labelB}`,
                datasetKeys: { x: 'x', y: 'y', id: 'id' },
                markerSize: 4,
            }
        ]}
        xAxis={[{ 
            label: `${labelA} Confidence`, 
            min: 0, 
            max: 1, 
            valueFormatter: (v) => `${(v * 100).toFixed(0)}%` 
        }]}
        yAxis={[{ 
            label: `${labelB} Confidence`, 
            min: 0, 
            max: 1,
            valueFormatter: (v) => `${(v * 100).toFixed(0)}%` 
        }]}
        margin={{ top: 10, bottom: 40, left: 50, right: 10 }}
        grid={{ horizontal: true, vertical: true }}
      />
    </Stack>
  );
}
