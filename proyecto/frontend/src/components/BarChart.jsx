import { Bar } from "react-chartjs-2";
import { useState, useEffect } from "react";

function BarChart({ dataBarras }) {
  const [chartDataBarras, setChartDataBarras] = useState({
    labels: dataBarras.map((data) => "sede: " + data.sede),
    datasets: [
      {
        label: "Votos de la sede",
        data: dataBarras.map((data) => data.contador),
        backgroundColor: [
          "#155C28",
          "#154C5C",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0"
        ],
        borderColor: "skyblue",
        borderWidth: 2
      }
    ]
  });

  useEffect(() => {
    setChartDataBarras({
      labels: dataBarras.map((data) => "Sede: " + data.sede.split("_").pop()),
      datasets: [
        {
          label: "Votos de la sede",
          data: dataBarras.map((data) => data.contador),
          backgroundColor: [
            "#155C28",
            "#154C5C",
            "#50AF95",
            "#f3ba2f",
            "#2a71d0"
          ],
          borderColor: "skyblue",
          borderWidth: 2
        }
      ]
    });
  }, [dataBarras]);

  return (
    <div>
      <div className="chart-container2">
        <h2 style={{ textAlign: "center" }}>5 sedes con mayor cantidad de votos</h2>
        <Bar
          data={chartDataBarras}
          options={{
            plugins: {
              title: {
                display: true,
                text: "Votos vs Sedes"
              },
              legend: {
                display: false
              }
            }
          }}
        />
      </div>
      <div className="table-container">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>Sede</th>
              <th>Departamento</th>
              <th>Municipio</th>
            </tr>
          </thead>
          <tbody>
            {dataBarras.map((data) => (
              <tr key={data.sede}>
                <td>{data.sede.split("_")[2]}</td>
                <td>{data.sede.split("_")[0]}</td>
                <td>{data.sede.split("_")[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BarChart;
