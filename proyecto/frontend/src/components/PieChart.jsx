import React from "react";
import { Pie } from "react-chartjs-2";
import ChartDataLabels from 'chartjs-plugin-datalabels';

function PieChart({ chartData, title, total_votos }) {
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
                const label = context.chart.data.labels[context.dataIndex];
                const percentage = (value / total_votos * 100).toFixed() + '%';
                if (value === 0) {
                  return '';
                }
                return label + '\n' + percentage;
              },
            },
          }
        }}
      />
      <h5 style={{ textAlign: "center" }}> {title} </h5>
      <h6 style={{ textAlign: "center" }}> Total de votos: {total_votos} </h6>
    </div>
  );
}
export default PieChart;
