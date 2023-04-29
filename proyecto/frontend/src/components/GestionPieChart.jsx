import React, { useState, useEffect } from "react";
import PieChart from "./PieChart";

function GestionPieChart({data}) {
    // Crear las opciones del select de departamento
    const departamentos = data.map(obj => obj.departamento).filter((dep, index, arr) => arr.indexOf(dep) === index);
    const opciones_departamento = departamentos.map((dep, index) => (
        <option key={index} value={dep}>{dep}</option>
    ));

    // Crear las opciones del select de municipios
    const municipios = data.map(obj => obj.municipio).filter((mun, index, arr) => arr.indexOf(mun) === index);
    const opciones_municipios = municipios.map((mun, index) => (
        <option key={index} value={mun}>{mun}</option>
    ));

    const [chartData, setChartData] = useState({
        labels: [], 
        datasets: [
        {
            label: "Cantidad",
            data: [],
            backgroundColor: [
            "#20EA56",
            "#70BEF3",
            "#21B9B7",
            "#EDAE2F",
            "#969BA4"
            ],
            borderColor: "skyblue",
            borderWidth: 2
        }
        ]
    });

    useEffect(() => {
        handleSubmit();
    }, []);

    const [option, setOption] = useState("depto");
    const [value1, setValue1] = useState("");
    const [value2, setValue2] = useState("");
    const [title, setTitle] = useState("");
    const [total_votos, setTotal_votos] = useState(0);

    const handleSubmit = () => {
        // Creamos la url de la petición
        let value = '';
        let name = '';
        if(option === "depto"){
            value = value1;
            name = "Departamento "
        }else{
            value = value2;
            name = "Municipio "
        }
        
        const url = `${process.env.REACT_APP_API_HOST}/getPie?option=${option}&value=${value}`;
        fetch(url)
        .then(response => response.json())  
        .then(data => {
            const { votosPorPartido, votosTotales } = data;
            const labels = Object.keys(votosPorPartido);
            const porcentajes = Object.values(votosPorPartido);
            const porcentajesNum = porcentajes.map(p => parseFloat(p));
            setTotal_votos(parseInt(votosTotales))
            setTitle(name + value)

            setChartData({
                labels: labels,
                datasets: [
                {
                    label: "Cantidad",
                    data: porcentajesNum,
                    backgroundColor: [
                    "#20EA56",
                    "#70BEF3",
                    "#21B9B7",
                    "#EDAE2F",
                    "#969BA4"
                    ],
                    borderColor: "skyblue",
                    borderWidth: 2
                }
                ]
            });
        })
        .catch(error => console.error(error));
    };


    return (
        <div >
            <PieChart chartData={chartData} title={title} total_votos={total_votos}/>   

            <div className="container mt-3" style={{ backgroundColor: "#D6EAF8", width:"100%" }}>
            <div className="row">
                <div className="col">
                <div className="form-check">
                    <input className="form-check-input" type="radio" name="option" id="option1" value="option1" 
                            checked={option === "depto"}
                            onChange={() => setOption("depto")}/>
                    <label className="form-check-label" for="option1">
                    Departamento
                    </label>
                </div>
                <select value={value1} onChange={(e) => setValue1(e.target.value)} className="form-select" id="select1">
                    <option value="">Seleccionar Opcion</option>
                    {opciones_departamento}
                </select>
                </div>
                <div className="col">
                <div className="form-check">
                    <input className="form-check-input" type="radio" name="option" id="option2" value="option2"
                        checked={option === "muni"}
                        onChange={() => setOption("muni")} />
                    <label className="form-check-label" for="option2">
                    Municipio
                    </label>
                </div>
                <select value={value2} onChange={(e) => setValue2(e.target.value)} className="form-select" id="select2">
                    <option value="">Seleccionar Opcion</option>
                    {opciones_municipios}
                </select>
                </div>
            </div>
            <div className="col text-center">
                <button onClick={handleSubmit} style={{ width:"100%" }} className="btn btn-primary mt-3">Graficar</button>
                </div>
            </div>
        </div>
    );
}
export default GestionPieChart;
