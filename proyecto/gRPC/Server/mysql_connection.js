var mysql      = require('mysql');

var mysqlConnection = mysql.createConnection({
  host     : 'db',
  user     : 'root',
  password : '1234',
  database : 'db_so1'
});

mysqlConnection.connect(function (err){
    if(err){
        console.log(' Error al conectarse a la base de datos ',err);
    } else {
        console.log(' Conexión a la base de datos exitosa ');
    }
});

module.exports = mysqlConnection;