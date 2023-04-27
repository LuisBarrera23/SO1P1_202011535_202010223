var mysql      = require('mysql');

var mysqlConnection = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE
});

mysqlConnection.connect(function (err){
    if(err){
        console.log(' Error al conectarse a la base de datos ',err);
    } else {
        console.log(' Conexión a la base de datos exitosa ');
    }
});

module.exports = mysqlConnection;