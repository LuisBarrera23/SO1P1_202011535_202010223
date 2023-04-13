import { Bar } from "react-chartjs-2";


function BarChart({ chartData }) {
  return (
    <div className="chart-container" >
      <h2 style={{ textAlign: "center" }}>Bar Chart</h2>
      <Bar
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "5 sedes con mayor cantidad de votos"
            },
            legend: {
              display: false
            }
          }
        }}
      />
    </div>
  );
};

export default BarChart;