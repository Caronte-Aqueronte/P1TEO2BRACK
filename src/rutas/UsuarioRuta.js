const express = require('express');
const { User } = require('../modelos/Usuario');
const articuloController = require("../controladores/UsuarioControlador");
const router = express.Router();


router.post('/login', articuloController.login);//definiendo ruta para crear archivo
router.post('/crearUsuarioNormal', articuloController.crearUsuarioNormal);//definiendo ruta para crear archivo
router.post('/crearUsuarioAdmin', articuloController.crearUsuarioAdmin);//definiendo ruta para crear archivo
router.get('/traerSolicitudes', articuloController.traerSolicitudes);//definiendo ruta para crear archivo
router.get('/traerUsuarios', articuloController.traerUsuarios);//definiendo ruta para crear archivo
router.get('/buscarUsuariosPorNombre', articuloController.buscarUsuariosPorNombre);//definiendo ruta para crear archivo
router.delete('/eliminarUsuario/:id', articuloController.eliminarUsuario);//definiendo ruta para crear archivo
router.post('/aceptarUsuario', articuloController.aceptarUsuario);//definiendo ruta para crear archivo








module.exports = router;//exporar el routers