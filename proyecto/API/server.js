const express = require('express');
const WebSocket = require('ws');
const mysql = require('mysql');
const cors = require('cors');

// Crear una instancia de express y un servidor HTTP
const app = express();
app.use(cors());
const server = require('http').createServer(app);

// Crear una instancia de WebSocket y conectarla al servidor HTTP
const wss = new WebSocket.Server({ server });

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '1234',
  database : 'db_so1'
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectarse a la base de datos: ', err);
    process.exit(1);
  }
  console.log('Conectado a base de Datos!');
});

// Endpoint HTTP
app.get('/data', (req, res) => {
  connection.query('SELECT * FROM Votos_data', (error, results, fields) => {
    if (error) {
      console.error('Error al hacer la peticion: ', error);
      res.status(500).send('Error');
      return;
    }
    res.json(results);
  });
});

app.get('/top3', (req, res) => {
  const query = `
    SELECT departamento, COUNT(*) as total_votos
    FROM Votos_data
    WHERE papeleta = 'Blanca'
    GROUP BY departamento
    ORDER BY total_votos DESC
    LIMIT 3
  `;

  connection.query(query, (err, result) => {
    if (err) {
      res.status(500).send('Error en la consulta');
    } else {
      const data = result.map(row => ({
        departamento: row.departamento,
        total_votos: row.total_votos,
      }));
      res.json(data);
    }
  });
});


app.get('/getPie', (req, res) => {
  const option = req.query.option;
  const depto_municipio = req.query.value;
  let depto_muni = "";
  if(option == "depto"){
    depto_muni = "departamento";
  }else if (option == "muni"){
    depto_muni = "municipio";
  }

  const partidos = ['UNE', 'VAMOS', 'FCN', 'UNIONISTA', 'VALOR'];
  let votosTotales = 0;

  // Obtener el total de votos para el departamento o municipio especificado para cada partido
  const votosPorPartidoPromises = [];
  for (const partido of partidos) {
    const promise = new Promise((resolve, reject) => {
      connection.query('SELECT COUNT(*) AS votos FROM Votos_data WHERE ' + depto_muni + '= ? AND partido = ?', [depto_municipio, partido], (error, results, fields) => {
        if (error) {
          console.error('Error al hacer la consulta: ' + error.stack);
          reject(error);
          return;
        }
        console.log(results[0])
        const votos = results[0].votos;
        resolve({ partido, votos });
      });
    });
    votosPorPartidoPromises.push(promise);
  }

  Promise.all(votosPorPartidoPromises)
    .then(votosPorPartidoArray => {
      const votosPorPartido = {};
      votosPorPartidoArray.forEach(({ partido, votos }) => {
        votosPorPartido[partido] = votos;
        votosTotales += votos;
      });

      const resultados = {
        votosPorPartido,
        votosTotales
      };

      // Devolver los resultados como un objeto JSON
      res.json(resultados);
    })
    .catch(error => {
      console.error('Error al obtener los votos por partido: ' + error.stack);
      res.status(500).send('Error al obtener los votos por partido');
    });
});


// Endpoint WebSocket
wss.on('connection', (ws) => {
  console.log('Cliente WebSocket conectado');

  // Enviar un mensaje al cliente cada segundo
  const intervalId = setInterval(() => {
    const currentDate = new Date().toLocaleString('es-ES');;
    ws.send(currentDate);
  }, 1000);

  // Manejar la desconexión del cliente
  ws.on('close', () => {
    console.log('Cliente WebSocket desconectado');
    clearInterval(intervalId);
  });
});

// Iniciar el servidor HTTP
server.listen(8080, () => {
  console.log('Servidor iniciado en el puerto 8080');
});
