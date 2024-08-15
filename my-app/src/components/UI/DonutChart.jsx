import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { createTheme, useTheme, ThemeProvider } from '@mui/material/styles';

function DonutChart({ score, data }) {
  const theme = useTheme();

  const newTheme = createTheme({
    palette: { mode: theme.palette.mode },
  });
  function getDonutChartColors(score) {
    if (score < 25) {
      return ['#00FF00', '#eeeeee']; // Green for scores below 25
    } else if (score <= 50) {
      return ['#FFA500', '#eeeeee']; // Orange for scores between 25 and 50
    } else {
      return ['#FF0000', '#eeeeee']; // Red for scores above 50
    }
  }
  return (
    <ThemeProvider theme={newTheme}>
      <div
        className="bg-white rounded-3 text-center"
        style={{ position: 'relative' }}
      >
        <PieChart
          series={[
            {
              data,
              innerRadius: 70,
              outerRadius: 100,
              paddingAngle: 5,
              cornerRadius: 7,
            },
          ]}
          margin={{ right: 5 }}
          legend={{ hidden: true }}
          width={400}
          height={350}
          colors={getDonutChartColors(score)}
        />
        <span
          className="fw-bold"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '36px',
          }}
        >
          {score}
        </span>
      </div>
    </ThemeProvider>
  );
}

export default DonutChart;
