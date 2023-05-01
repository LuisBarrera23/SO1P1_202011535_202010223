const express = require('express');
const app = express();
var morgan = require('morgan');
var cors = require('cors');
const client = require('./gRPC_client')

//Settings
const port = 7070;

//Middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

//Routes
app.get('/', (req, res) => {
  res.send('gRPC funcionando!');
});

app.post('/grpc/agregarCaso',  function(req, res) {
  const data_caso = {
    sede : req.body.sede,
    municipio : req.body.municipio,
    departamento : req.body.departamento,
    papeleta : req.body.papeleta,
    partido : req.body.partido
  }

  client.addData(data_caso, function(err, response) {
    res.status(200).json({mensaje: response.message})
  });
});

app.listen(port,()=>{
  console.log('Servidor en el puerto', port);
});
