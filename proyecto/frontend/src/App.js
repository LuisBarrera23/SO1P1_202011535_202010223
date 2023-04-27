import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import React, { useState, useEffect } from "react";
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
  const [dataBarras, setdataBarras] = useState([]);
  const [dataTabla, setdataTabla] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      Promise.all([
        fetch("http://localhost:8080/data").then((response) => response.json()),
        fetch("http://localhost:8080/redis").then((response) => response.json())
      ]).then(([data, redisData]) => {
        console.log(redisData.sede_counters);
        setData(data);
        setdataTabla(redisData.last_five);
        if (redisData.sede_counters.length > 0) {
          setdataBarras(redisData.sede_counters);
        }
        
      }).catch((error) => console.error(error));
    };
    // Se ejecuta fetchData() inmediatamente y luego cada 1 segundo
    const intervalId = setInterval(fetchData, 1000);
    // Devuelve una función para cancelar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, []);
  


 
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
          <BarChart dataBarras={dataBarras}/> 
        </div>
      </div>
    </div>  

    <div class="container container2">
      <div class="row">
        <div class="col mx-auto">        
        <div>
        <h3 style={{color:"white"}}>Top 3</h3>
        <h4>Departamentos con mayores votos para presidente</h4>
        
        <Top3/>
      </div>
        </div>
        <div class="col">
          <h3 style={{color:"white"}}>Ultimos 5 votos</h3>
          <Tabla dataTabla={dataTabla}></Tabla>
        </div>
      </div>
    </div> 
    <div class="container">
      <h2>Datos almacenados en MySQL</h2>
      <textarea style={{ height: '400px' }} className="form-control" readOnly value={JSON.stringify(data, null, 2)} />

    </div>
    

    <Footer></Footer>

    </div>
  );
}