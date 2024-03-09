const express = require('express');
const { Producto } = require('../modelos/Producto');
const productoController = require("../controladores/ProductoControlador");
const router = express.Router();
const storage = require('../config/multer');
const multer = require('multer');
const uploader = multer({storage}).single('file');//indicamos que solo se recibira una imagen en un parametro 'file'

router.post('/crearProducto',uploader, productoController.crearProducto);//definiendo ruta para crear archivo
router.delete('/eliminarProducto/:id', productoController.eliminarProducto);
router.get('/traerProductosAprobadosDeUnUsuario', productoController.traerProductosAprobadosDeUnUsuario);
router.get('/traerProductosPendientesDeUnUsuario', productoController.traerProductosPendientesDeUnUsuario);
router.get('/traerProductosRechazadosDeUnUsuario', productoController.traerProductosRechazadosDeUnUsuario);
router.get('/traerProductosVendidosDelUsuario', productoController.traerProductosVendidosDelUsuario);
module.exports = router;//exporar el routers