const express = require('express');
const WebSocket = require('ws');
const mysql = require('mysql');
const cors = require('cors');

const redis = require('redis');
const client = redis.createClient({
  host: 'localhost',
  port: 6379
});

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

app.get('/redis', async (req, res) => {
  try {
    await client.connect();
    const valuesLastFive = await client.lRange('last_five', 0, -1);
    const valuesSedeCounters = await client.hGetAll('sede_counters')
    await client.quit();
    
    const data = {
      last_five: [],
      sede_counters: {}
    };
    
    if (valuesLastFive && valuesLastFive.length) {
      // convierte cada cadena JSON en un objeto JavaScript
      const arrayObjetos = valuesLastFive.map(cadenaJSON => JSON.parse(cadenaJSON));
      data.last_five = arrayObjetos;
    }
    
    if (valuesSedeCounters) {
      // convierte el objeto de la forma {"sede_contador": "valor"} a un array de objetos de la forma {"sede": "valor", "contador": "valor"}
      const arraySedeCounters = Object.entries(valuesSedeCounters).map(([key, value]) => ({
        sede: key,
        contador: parseInt(value)
      }));
    
      // ordena el array por el valor del contador y lo limita a los primeros 5 elementos
      const topFive = arraySedeCounters.sort((a, b) => b.contador - a.contador).slice(0, 5);
    
      data.sede_counters = topFive;
    }
    
    res.json(data); // envía la respuesta como un objeto JSON
  } catch (error) {
    console.error(error);
    res.status(500).send('Ocurrió un error al obtener los valores');
  }
});


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
