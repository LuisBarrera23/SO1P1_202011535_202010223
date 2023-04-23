

function Tabla({dataTabla}) {
  const items = Array.isArray(dataTabla) ? dataTabla : [];
 
    return (  
      <div style={{marginTop:"34px"}}>
        <table class="table table-hover table-dark">
        <thead>
            <tr>
            <th scope="col">Sede</th>
            <th scope="col">Municipio</th>
            <th scope="col">Departamento</th>
            <th scope="col">Papeleta</th>
            <th scope="col">Partido</th>
            </tr>
        </thead>
        <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>{item.sede}</td>
                <td>{item.municipio}</td>
                <td>{item.departamento}</td>
                <td>{item.papeleta}</td>
                <td>{item.partido}</td>
              </tr>
            ))}
        </tbody>
        </table>
      </div>
    );
  };
  
  export default Tabla;