const express = require('express');
const retiroController = require("../controladores/RetiroControlador");
const router = express.Router();

router.get('/traerRetirosDelUsuario', retiroController.traerRetirosDelUsuario);//definiendo ruta para crear compra
module.exports = router;