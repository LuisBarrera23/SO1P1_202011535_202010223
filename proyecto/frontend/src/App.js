import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { useState } from "react";
import { Data } from "./Data";
import { DataBarras } from "./DataBarras";
import PieChart from "./components/PieChart";
import BarChart from "./components/BarChart";
import WebSocket from "./components/WebSocketExample"

Chart.register(CategoryScale);
 
export default function App() {
  const [chartData, setChartData] = useState({
    labels: Data.map((data) => data.partido), 
    datasets: [
      {
        label: "porcentaje",
        data: Data.map((data) => data.porcentaje),
        backgroundColor: [
          "#20EA56",
          "#2069EA",
          "#21B9B7",
          "#EDAE2F",
          "#969BA4"
        ],
        borderColor: "skyblue",
        borderWidth: 2
      }
    ]
  });
const [chartDataBarras, setChartDataBarras] = useState({
  labels: DataBarras.map((data) => "sede: " + data.sede),
  datasets: [
    {
      label: "Votos de la sede",
      data: DataBarras.map((data) => data.votos),
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

 
  return (
    <div className="App">
      <div>
        <PieChart chartData={chartData} />   
      </div>
      <div>
        <BarChart chartData={chartDataBarras}/>   
      </div>
      <div>
        <br></br>
        <br></br>
        <WebSocket/>
      </div>        
    </div>
  );
}