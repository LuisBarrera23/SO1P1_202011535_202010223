var express = require('express');
var router = express.Router();
const client = require('../gRPC_client')

router.post('/agregarCaso',  function(req, res) {
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

module.exports = router;