var PROTO_PATH = './proto/demo.proto';

var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var demo_proto = grpc.loadPackageDefinition(packageDefinition).demo;

/* Conexion a la base de datos */
const mysqlConnection = require('./mysql_connection');

function addData(call, callback) {
  const query = 'INSERT INTO Votos_data (sede,municipio,departamento,papeleta,partido) VALUES ('+
  '\''+call.request.sede+'\','+
  '\''+call.request.municipio+'\','+
  '\''+call.request.departamento+'\','+
  '\''+call.request.papeleta+'\','+
  '\''+call.request.partido+'\');';
  
  mysqlConnection.query(query, function(err, rows, fields) {
    if (err) throw err;
    callback(null, {message: 'Caso insertado en la base de datos'});
  }); 
} 

function main() {
  var server = new grpc.Server();
  server.addService(demo_proto.Datos.service, {
    addData: addData
  });
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
    console.log("gRPC server en puerto 50051")
  });
}

main();
