const express = require('express');
const Compra = require('../modelos/Compra'); // Importa el modelo Compra
const compraController = require("../controladores/CompraControlador");
const router = express.Router();
const storage = require('../config/multer');
const multer = require('multer');
const uploader = multer({storage}).single('file');//indicamos que solo se recibira una imagen en un parametro 'file'

router.post('/crearCompra',uploader, compraController.crearCompra);//definiendo ruta para crear compra
router.delete('/eliminarCompra/:id', compraController.eliminarCompra);
module.exports = router;