const express = require('express');
const WebSocket = require('ws');

// Crear una instancia de express y un servidor HTTP
const app = express();
const server = require('http').createServer(app);

// Crear una instancia de WebSocket y conectarla al servidor HTTP
const wss = new WebSocket.Server({ server });

// Endpoint HTTP
app.get('/api/data', (req, res) => {
  // Lógica para obtener datos y devolverlos como respuesta
  res.send('Aquí están los datos de la API HTTP');
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
  console.log('Servidor iniciado en el puerto 3000');
});
