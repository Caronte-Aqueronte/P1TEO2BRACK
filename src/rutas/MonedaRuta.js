const express = require('express');
const monedaController = require("../controladores/MonedaControlador");
const router = express.Router();

router.post('/recargarMonedas', monedaController.recargarMonedas);//definiendo ruta para crear compra
router.post('/retirarMonedas', monedaController.retirarMonedas);//definiendo ruta para crear compra
router.get('/traerMonedasUsuario', monedaController.traerMonedasUsuario);//definiendo ruta para crear compra
router.get('/traerMonedasRetirablesUsuario', monedaController.traerMonedasRetirablesUsuario);//definiendo ruta para crear compra



module.exports = router;