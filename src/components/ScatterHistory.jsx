import React from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { ChartsTooltipContainer, useItemTooltip } from '@mui/x-charts/ChartsTooltip';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';

const TooltipPaper = styled('div', {
  name: 'Tooltip',
  slot: 'Paper',
})(({ theme }) => {
  return {
    padding: theme.spacing(1),
    backgroundColor: (theme.vars || theme).palette.background.paper,
    color: (theme.vars || theme).palette.text.primary,
    borderRadius: (theme.vars || theme).shape?.borderRadius,
    border: `solid ${(theme.vars || theme).palette.divider} 1px`,
  };
});

function CustomTooltip() {
  const item = useItemTooltip();

  if (!item) return null;

  return (
    <ChartsTooltipContainer trigger="item">
      <TooltipPaper>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Box
            sx={{
              width: 10,
              height: 10,
              backgroundColor: item.color,
              borderRadius: '50%',
              mr: 1,
            }}
          />
          <Typography variant="subtitle2">{item.seriesLabel}</Typography>
        </Box>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
             Time: {(item.value.x / 1000).toFixed(2)}s
            </Typography>
            <Typography variant="body2" fontWeight="bold">
             Confidence: {(item.value.y * 100).toFixed(1)}%
            </Typography>
        </Box>
      </TooltipPaper>
    </ChartsTooltipContainer>
  );
}

export default function ScatterHistory({ history }) {
  if (!history || history.length === 0) return null;

  // 1. Identify all unique class labels
  const uniqueLabels = [...new Set(history.map(item => item.label))];
  
  // 2. Build series data 
  // history items: { timestamp: number, label: string, scores: { [label]: number } }
  // We want to plot the confidence of the *winning* label at that timestamp?
  // Or plot all scores?
  // The user prompt implies "percentage of each class in the recording" was for the previous bar chart.
  // For scatter, usually "Winning Label" vs Time is good, or "Confidence of Winning Label".
  
  // Let's create a series for each label.
  // Points are added to a series ONLY if that label was the winner (or maybe if score > threshold?).
  // Let's go with "Winner" based on `item.label` which is the top prediction.
  
  const series = uniqueLabels.map((label) => {
      const labelData = history
        .filter((item) => item.label === label)
        .map((item, index) => ({
            x: item.timestamp,
            y: item.scores[label], // Confidence of this label
            id: `${label}-${item.timestamp}-${index}`
        }));
      
      return {
          type: 'scatter',
          label: label,
          data: labelData,
          valueFormatter: (v) => `Running...`, // overridden by custom tooltip
          highlightScope: { highlight: 'series', fade: 'global' },
          markerSize: 5,
      };
  });

  return (
    <Stack width="100%" spacing={2} sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h6" component="div">
        Detection Confidence Over Time
      </Typography>
      <ScatterChart
        height={300}
        series={series}
        grid={{ horizontal: true, vertical: true }}
        yAxis={[{ label: 'Confidence', min: 0, max: 1 }]}
        xAxis={[{ label: 'Time (ms)', min: 0 }]}
        slots={{ tooltip: CustomTooltip }}
        margin={{ top: 10, bottom: 40, left: 50, right: 10 }}
      />
    </Stack>
  );
}
