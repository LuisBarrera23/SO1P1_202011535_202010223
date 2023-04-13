import React from "react";
import { Pie } from "react-chartjs-2";
import ChartDataLabels from 'chartjs-plugin-datalabels';

function PieChart({ chartData }) {
  return (
    <div className="chart-container" >
      <h2 style={{ textAlign: "center" }}>Pie Chart</h2>
      <Pie
        data={chartData}
        plugins={[ChartDataLabels]}
        options={{
          cutoutPercentage: 20,
          title: {
            display: true,
            text: "Porcentaje de Votos"
          },
          plugins: {
            datalabels: {
              color: '#ffffff',
              font: {
                size: 18,
                weight: 'bold',
              },
              formatter: function(value, context) {
                return context.chart.data.labels[context.dataIndex] + '\n' + value + "%";
              },
            },
          }
        }}
      />
    </div>
  );
}
export default PieChart;
