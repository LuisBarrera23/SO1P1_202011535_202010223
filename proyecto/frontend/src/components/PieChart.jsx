import React from "react";
import { Pie } from "react-chartjs-2";
import ChartDataLabels from 'chartjs-plugin-datalabels';

function PieChart({ chartData }) {
  return (
    <div className="chart-container1" >
      <h2 style={{ textAlign: "center" }}>Pie Chart</h2>
      <Pie
        data={chartData}
        plugins={[ChartDataLabels]}
        options={{
          title: {
            display: true,
            text: "Porcentaje de Votos",
            position: 'top'
          },
          plugins: {
            datalabels: {
              color: '#43475C ',
              font: {
                size: 12,
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
