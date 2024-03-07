const express = require('express');
const { Tag } = require('../modelos/Tag');
const tagControlador = require("../controladores/TagControlador");
const router = express.Router();


router.post('/crearTag', tagControlador.crearTag);//definiendo ruta para crear tag
router.get('/traerTagsDeUnUsuario', tagControlador.traerTagsDeUnUsuario);
router.get('/traerTodosLosTags', tagControlador.traerTodosLosTags);
router.delete('/eliminarTag/:id', tagControlador.eliminarTagPorId);
module.exports = router;//exporar el routers