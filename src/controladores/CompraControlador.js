const Compra = require('../modelos/Compra'); // Importa el modelo Compra
const TagCompra = require('../modelos/TagCompra'); // Importa el modelo Compra
const sequelize = require('../sequelize'); // Importa la instancia de Sequelize
const { Op } = require('sequelize');

const crearCompra = async (req, res) => {
    try {
        // Verificar si los parámetros son nulos
        if (!req.body.nombre || !req.body.descripcion || !req.body.userId ||
            !req.file || !req.body.tags || !req.body.mostrar_contacto) {
            return res.json({ bandera: false, mensaje: 'Faltan datos requeridos para crear el producto o los tags no son un array' });
        }

        // Parsear la cadena JSON de tags a un array de objetos
        const tags = JSON.parse(req.body.tags);

        if (!Array.isArray(tags)) {
            return res.json({ bandera: false, mensaje: 'Los tags no son un array' });
        }

        // Crear una nueva compra en la base de datos
        const nuevaCompra = await Compra.create({
            nombre: req.body.nombre,
            imagen: req.file.filename,
            descripcion: req.body.descripcion,
            mostrar_contacto: req.body.mostrar_contacto,
            UserId: req.body.userId // Asignar el ID del usuario al producto
        });

        // Asignar los tags al producto recién creado
        await Promise.all(tags.map(async (tag) => {
            await TagCompra.create({
                TagId: tag.id,
                CompraId: nuevaCompra.id
            });
        }));
        return res.json({ bandera: true, mensaje: 'Compra creada correctamente', producto: nuevaCompra });
    } catch (error) {
        console.error(error);
        return res.json({ bandera: false, mensaje: 'Error al crear compra' });
    }
}

const eliminarCompra = async (req, res) => {
    try {
        // Verificar si el parámetro es nulo
        if (!req.params.id) {
            return res.json({ bandera: false, mensaje: 'Falta el ID de la compra a eliminar' });
        }
        // Buscar la compra por su ID
        const compraEliminar = await Compra.findByPk(req.params.id);
        // Verificar si la compra existe
        if (!compraEliminar) {
            return res.json({ bandera: false, mensaje: 'La compra no existe' });
        }
        // Eliminar la compra de la base de datos
        await compraEliminar.destroy();

        return res.json({ bandera: true, mensaje: 'Compra eliminada correctamente' });
    } catch (error) {
        console.error(error);
        return res.json({ bandera: false, mensaje: 'Error al eliminar la compra' });
    }
};
module.exports = {
    crearCompra,
    eliminarCompra
};