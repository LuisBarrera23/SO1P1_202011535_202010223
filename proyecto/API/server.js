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
