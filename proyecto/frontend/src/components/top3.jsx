import { useState, useEffect } from "react";

function Top3({data}) {
  const [top3, setTop3] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      fetch("http://localhost:8080/top3")
        .then((response) => response.json())
        .then((data) => setTop3(data))
        .catch((error) => console.error(error));
    };
  
    fetchData(); // Ejecutar fetch() una vez al cargar el componente
  
    const interval = setInterval(() => {
      fetchData(); // Ejecutar fetch() cada 1 segundo
    }, 1000);
  
    return () => clearInterval(interval); // Limpiar el intervalo cuando el componente se desmonte
  }, []);

  return (
    <div className="container">
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Departamento</th>
            <th scope="col">Votos</th>
          </tr>
        </thead>
        <tbody>
          {top3.map((item, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{item.departamento}</td>
              <td>{item.total_votos}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Top3;
