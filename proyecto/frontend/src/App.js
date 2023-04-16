import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import React, { useState, useEffect } from "react";
import { DataBarras } from "./DataBarras";
import GestionPieChart from "./components/GestionPieChart";
import BarChart from "./components/BarChart";
import WebSocket from "./components/WebSocketExample"
import Tabla from "./components/tabla5votos";
import Top3 from "./components/top3";
import './App.css';
import Footer from "./components/footer";


Chart.register(CategoryScale);
 
export default function App() {

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/data")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }, []);
  
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

        <GestionPieChart data={data}/>

        <div>
        
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