const express = require('express');
const reporteController = require("../controladores/ReporteControlador");
const router = express.Router();

router.post('/crearReporte', reporteController.crearReporte);//definiendo ruta para crear archivo
router.delete('/eliminarReportes/:id', reporteController.eliminarReportesPorPublicacion);
module.exports = router;//exporar el routers