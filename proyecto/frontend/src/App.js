import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { useState } from "react";
import { Data } from "./Data";
import { DataBarras } from "./DataBarras";
import PieChart from "./components/PieChart";
import BarChart from "./components/BarChart";
import WebSocket from "./components/WebSocketExample"
import Tabla from "./components/tabla5votos";
import Top3 from "./components/top3";
import './App.css';
import Footer from "./components/footer";



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

    <div class="container">
    <WebSocket/>
      <div class="row">
        <div class="col mx-auto">        
        <div>
        <PieChart chartData={chartData} />   
      </div>
        </div>
        <div class="col">
          <BarChart chartData={chartDataBarras}/> 
        </div>
      </div>
    </div>  

    <div class="container container2">
      <div class="row">
        <div class="col mx-auto">        
        <div>
        <h3>Top 3</h3>
        <Top3></Top3>
      </div>
        </div>
        <div class="col">
          <h3>Ultimos 5 votos</h3>
          <Tabla></Tabla>
        </div>
      </div>
    </div> 

    <Footer></Footer>

    </div>
  );
}