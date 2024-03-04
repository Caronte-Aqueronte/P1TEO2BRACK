const Producto = require('../modelos/Producto'); // Importa el modelo User
const sequelize = require('../sequelize'); // Importa la instancia de Sequelize

const crearProducto = async (req, res) => {
    try {
        // Verificar si los parámetros son nulos
        if (!req.body.nombre || !req.body.precio || !req.body.descripcion || !req.body.userId ||
            !req.file) {
            return res.json({ bandera: false, mensaje: 'Faltan datos requeridos para crear el producto' });
        }

        // Contar los productos aprobados del usuario
        const countApprovedProducts = await Producto.count({
            where: {
                UserId: req.body.userId,
                estado_aprobacion: true
            }
        });

        var estado_aprobacion = false;
        // Actualizar el estado de aprobación del usuario si tiene más de 5 productos aprobados
        if (countApprovedProducts >= 5) {
            estado_aprobacion = true
        }

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

        if (estado_aprobacion) {
            return res.json({ bandera: true, mensaje: 'Producto creado correctamente', producto: nuevoProducto });
        } else {
            return res.json({ bandera: true, mensaje: 'Producto creado correctamente, pendiente de aprovación', producto: nuevoProducto });
        }


    } catch (error) {
        return res.json({ bandera: false, mensaje: 'Error al crear producto' });
    }
}

module.exports = {
    crearProducto
};
