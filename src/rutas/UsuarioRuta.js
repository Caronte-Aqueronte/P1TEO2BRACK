const express = require('express');
const { User } = require('../modelos/Usuario');
const articuloController = require("../controladores/UsuarioControlador");
const router = express.Router();


router.post('/login', articuloController.login);//definiendo ruta para crear archivo
router.post('/crearUsuarioNormal', articuloController.crearUsuarioNormal);//definiendo ruta para crear archivo

module.exports = router;//exporar el routers