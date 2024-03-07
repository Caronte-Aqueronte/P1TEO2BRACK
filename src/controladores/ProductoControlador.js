const Producto = require('../modelos/Producto'); // Importa el modelo User
const sequelize = require('../sequelize'); // Importa la instancia de Sequelize
const TagProducto = require('../modelos/TagProducto')
const crearProducto = async (req, res) => {
    try {
        console.log(req.body);
        // Verificar si los parámetros son nulos
        if (!req.body.nombre || !req.body.precio || !req.body.descripcion || !req.body.userId ||
            !req.file || !req.body.tags) {
            return res.json({ bandera: false, mensaje: 'Faltan datos requeridos para crear el producto o los tags no son un array' });
        }

        // Parsear la cadena JSON de tags a un array de objetos
        const tags = JSON.parse(req.body.tags);

        if(!Array.isArray(tags)){
            return res.json({ bandera: false, mensaje: 'Los tags no son un array' });
        }
        // Contar los productos aprobados del usuario
        const countApprovedProducts = await Producto.count({
            where: {
                UserId: req.body.userId,
                estado_aprobacion: true
            }
        });

        let estado_aprobacion = countApprovedProducts >= 5;

        // Crear un nuevo producto en la base de datos
        const nuevoProducto = await Producto.create({
            nombre: req.body.nombre,
            precio: req.body.precio,
            imagen: req.file.filename,
            descripcion: req.body.descripcion,
            estado_aprobacion: estado_aprobacion,
            estado_venta: false,
            UserId: req.body.userId // Asignar el ID del usuario al producto
        });

        // Asignar los tags al producto recién creado
        await Promise.all(tags.map(async (tag) => {
            await TagProducto.create({
                TagId: tag.id,
                ProductoId: nuevoProducto.id
            });
        }));

        if (estado_aprobacion) {
            return res.json({ bandera: true, mensaje: 'Producto creado correctamente', producto: nuevoProducto });
        } else {
            return res.json({ bandera: true, mensaje: 'Producto creado correctamente, pendiente de aprobación', producto: nuevoProducto });
        }

    } catch (error) {
        console.error(error);
        return res.json({ bandera: false, mensaje: 'Error al crear producto' });
    }
};

module.exports = {
    crearProducto
};
