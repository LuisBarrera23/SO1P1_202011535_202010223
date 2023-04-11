import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { useState } from "react";
import { Data } from "./Data";
import PieChart from "./components/PieChart";
import BarChart from "./components/BarChart";
import WebSocket from "./components/WebSocketExample"

Chart.register(CategoryScale);
 
export default function App() {
  const [chartData, setChartData] = useState({
    labels: Data.map((data) => data.year), 
    datasets: [
      {
        label: "Users Gained ",
        data: Data.map((data) => data.userGain),
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
        <br></br>
        <br></br>
        <WebSocket/>
      </div>        
    </div>
  );
}