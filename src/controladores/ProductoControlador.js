const Producto = require('../modelos/Producto'); // Importa el modelo User
const Usuario = require('../modelos/Usuario');
const Tag = require('../modelos/Tag'); // Importa el modelo User
const sequelize = require('../sequelize'); // Importa la instancia de Sequelize
const { Op } = require('sequelize');
const TagProducto = require('../modelos/TagProducto');
const Reporte = require('../modelos/Reporte');
const User = require('../modelos/Usuario');
const crearProducto = async (req, res) => {
    try {
        // Verificar si los parámetros son nulos
        if (!req.body.nombre || !req.body.precio || !req.body.descripcion || !req.body.userId ||
            !req.file || !req.body.tags || !req.body.mostrar_contacto) {
            return res.json({ bandera: false, mensaje: 'Faltan datos requeridos para crear el producto o los tags no son un array' });
        }

        // Parsear la cadena JSON de tags a un array de objetos
        const tags = JSON.parse(req.body.tags);

        if (!Array.isArray(tags)) {
            return res.json({ bandera: false, mensaje: 'Los tags no son un array' });
        }
        // Contar los productos aprobados del usuario
        const countApprovedProducts = await Producto.count({
            where: {
                UserId: req.body.userId,
                estado_aprobacion: 1
            }
        });

        let estado_aprobacion = 0;

        if (countApprovedProducts >= 5) {
            estado_aprobacion = 1;
        }

        // Crear un nuevo producto en la base de datos
        const nuevoProducto = await Producto.create({
            nombre: req.body.nombre,
            precio: req.body.precio,
            imagen: req.file.filename,
            descripcion: req.body.descripcion,
            estado_aprobacion: estado_aprobacion,
            mostrar_contacto: req.body.mostrar_contacto,
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

        if (estado_aprobacion === 1) {
            return res.json({ bandera: true, mensaje: 'Producto creado correctamente', producto: nuevoProducto });
        } else {
            return res.json({ bandera: true, mensaje: 'Producto creado correctamente, pendiente de aprobación', producto: nuevoProducto });
        }

    } catch (error) {
        console.error(error);
        return res.json({ bandera: false, mensaje: 'Error al crear producto' });
    }
}

const eliminarProducto = async (req, res) => {
    try {
        // Verificar si el parámetro es nulo
        if (!req.params.id) {
            return res.json({ bandera: false, mensaje: 'Falta el ID del producto a eliminar' });
        }

        // Buscar el producto por su ID
        const productoAEliminar = await Producto.findByPk(req.params.id);

        // Verificar si el producto existe
        if (!productoAEliminar) {
            return res.json({ bandera: false, mensaje: 'El producto no existe' });
        }

        // Eliminar el producto de la base de datos
        await productoAEliminar.destroy();

        return res.json({ bandera: true, mensaje: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error(error);
        return res.json({ bandera: false, mensaje: 'Error al eliminar el producto' });
    }
};


const traerProductosAprobadosDeUnUsuario = async (req, res) => {
    try {
        // Verificar si el parámetro userId es nulo
        if (!req.query.userId) {
            return res.json([]);
        }

        // Buscar tags en función del ID del usuario
        const productos = await Producto.findAll({
            where: {
                UserId: req.query.userId,
                estado_aprobacion: 1,
                estado_venta: 0
            }
        });

        return res.json({ productos: productos });
    } catch (error) {
        console.log(error)
        return res.json([]);
    }
}

const traerProductosVendidosDelUsuario = async (req, res) => {
    try {
        // Verificar si el parámetro userId es nulo
        if (!req.query.userId) {
            return res.json([]);
        }

        // Buscar tags en función del ID del usuario
        const productos = await Producto.findAll({
            where: {
                UserId: req.query.userId,
                estado_venta: 1,
            }
        });

        return res.json({ productos: productos });
    } catch (error) {
        console.log(error)
        return res.json([]);
    }
}


const traerProductosPendientesDeUnUsuario = async (req, res) => {
    try {
        // Verificar si el parámetro userId es nulo
        if (!req.query.userId) {
            return res.json([]);
        }

        // Buscar tags en función del ID del usuario
        const productos = await Producto.findAll({
            where: {
                UserId: req.query.userId,
                estado_aprobacion: 0,
                estado_venta: 0
            }
        });

        return res.json({ productos: productos });
    } catch (error) {
        console.log(error)
        return res.json([]);
    }
}
const traerProductosRechazadosDeUnUsuario = async (req, res) => {
    try {
        // Verificar si el parámetro userId es nulo
        if (!req.query.userId) {
            return res.json([]);
        }

        // Buscar tags en función del ID del usuario
        const productos = await Producto.findAll({
            where: {
                UserId: req.query.userId,
                estado_aprobacion: -1,
            }
        });

        return res.json({ productos: productos });
    } catch (error) {
        console.log(error)
        return res.json([]);
    }
}


const traerProductoPorId = async (req, res) => {
    try {
        // Verificar si el parámetro productId es nulo
        if (!req.query.id) {
            return res.json([]);
        }

        // Buscar el producto por su ID incluyendo información del usuario y los tags asociados
        const producto = await Producto.findByPk(req.query.id, {
            include: [
                { model: Usuario }, // Incluir información del usuario
                { model: Tag },   // Incluir información de los tags
                { model: Reporte }

            ]
        });

        if (!producto) {
            return res.json({ bandera: false, mensaje: "El producto no existe" });
        }

        // Obtener los nombres de los tags asociados al producto
        const nombresTags = producto.Tags.map(tag => tag.nombre_tag);

        return res.json({
            bandera: true,
            producto: {
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                descripcion: producto.descripcion,
                imagen: producto.imagen,
                mostrar_contacto: producto.mostrar_contacto,
                usuario: {
                    id: producto.User.id,
                    nombre: producto.User.nombre_usuario,
                    // Agregar más campos del usuario si es necesario
                },
                tags: nombresTags // Agregar los nombres de los tags al objeto producto
                ,reportes: producto.Reportes
            }
        });
    } catch (error) {
        console.log(error)
        return res.json({ bandera: false, mensaje: "Error al buscar producto." });
    }
}



const recomendarProductos = async (req, res) => {
    try {
        const nombreProducto = req.body.nombreProducto;
        const etiquetas = req.body.etiquetas;
        const idUsuario = req.body.idUsuario;

        if (nombreProducto === undefined || etiquetas === undefined
            || idUsuario === undefined) {
            return res.json({ productosRecomendados: [] });
        }

        // Extraer solo los nombres de las etiquetas del array de objetos
        const nombresEtiquetas = etiquetas.map(etiqueta => etiqueta.nombre_tag);
        let productosPorNombre = [];

        if (nombreProducto !== "") {
            // Buscar productos por coincidencia de nombre
            productosPorNombre = await Producto.findAll({
                where: {
                    nombre: {
                        [Op.like]: `%${nombreProducto}%`
                    },
                    estado_aprobacion: 1,
                    estado_venta: false,
                    UserId: {
                        [Op.ne]: idUsuario // Excluir productos del usuario
                    }
                },
                include: [Tag] // Incluir las etiquetas asociadas a los productos
            });

        }

        // Buscar productos por etiquetas
        const productosPorEtiquetas = await Producto.findAll({
            where: {
                estado_aprobacion: 1,
                estado_venta: false,
                UserId: {
                    [Op.ne]: idUsuario // Excluir productos del usuario
                }
            },
            include: [{
                model: Tag,
                where: {
                    nombre_tag: {
                        [Op.in]: nombresEtiquetas // Usar solo los nombres de las etiquetas
                    }
                }
            }]
        });

        // Combinar los resultados de ambas búsquedas y eliminar duplicados
        let productosRecomendados = [...productosPorNombre, ...productosPorEtiquetas];
        productosRecomendados = eliminarDuplicados(productosRecomendados);
        // Seleccionar máximo 5 productos recomendados
        productosRecomendados = productosRecomendados.slice(0, 5);

        return res.json({ productosRecomendados: productosRecomendados });
    } catch (error) {
        console.error(error);
        return res.json({ productosRecomendados: [] });
    }
};

// Función para eliminar productos duplicados
function eliminarDuplicados(array) {
    const uniqueArray = [];
    const idsSet = new Set();

    for (const item of array) {
        if (!idsSet.has(item.id)) {
            uniqueArray.push(item);
            idsSet.add(item.id);
        }
    }

    return uniqueArray;
}

const traerSolicitudesDeAprovacion = async (req, res) => {
    try {
        // Buscar tags en función del ID del usuario
        const productos = await Producto.findAll({
            where: {
                estado_aprobacion: 0,
            },
            include: [
                { model: Usuario }, // Incluir información del usuario
            ]
        });

        return res.json({ productos: productos });
    } catch (error) {
        console.log(error)
        return res.json([]);
    }
}

const aceptarProducto = async (req, res) => {
    try {
        // Verificar si el parámetro productId es nulo
        if (!req.body.id) {
            return res.json({ bandera: false, mensaje: 'El ID del producto no fue proporcionado' });
        }

        // Buscar el producto por su ID
        const producto = await Producto.findByPk(req.body.id);

        // Verificar si el producto existe
        if (!producto) {
            return res.json({ bandera: false, mensaje: 'El producto no existe' });
        }

        // Actualizar el estado de aprobación del producto a 1
        await producto.update({ estado_aprobacion: 1 });

        return res.json({ bandera: true, mensaje: 'Producto aceptado correctamente', producto: producto });

    } catch (error) {
        console.error(error);
        return res.json({ bandera: false, mensaje: 'Error al aceptar el producto' });
    }
}


const rechazarProducto = async (req, res) => {
    try {
        // Verificar si el parámetro productId es nulo
        if (!req.body.id) {
            return res.json({ bandera: false, mensaje: 'El ID del producto no fue proporcionado' });
        }

        // Buscar el producto por su ID
        const producto = await Producto.findByPk(req.body.id);

        // Verificar si el producto existe
        if (!producto) {
            return res.json({ bandera: false, mensaje: 'El producto no existe' });
        }

        // Actualizar el estado de aprobación del producto a 1
        await producto.update({ estado_aprobacion: -1 });

        return res.json({ bandera: true, mensaje: 'Producto rechazado correctamente', producto: producto });

    } catch (error) {
        console.error(error);
        return res.json({ bandera: false, mensaje: 'Error al rechazar el producto' });
    }
}

const mostrarProductosReportados = async (req, res) => {
    try {
        // Buscar todos los productos que tienen al menos un reporte asociado
        const productosReportados = await Producto.findAll({
            include: [
                {
                    model: Reporte,
                    required: true, // Asegura que solo se devuelvan productos con al menos un reporte
                },
            ]
        });

        return res.json(productosReportados);
    } catch (error) {
        console.error('Error al mostrar productos reportados:', error);
        return res.json([]);
    }
}


module.exports = {
    crearProducto,
    traerProductosAprobadosDeUnUsuario,
    traerProductosPendientesDeUnUsuario,
    traerProductosRechazadosDeUnUsuario,
    traerProductosVendidosDelUsuario,
    eliminarProducto,
    recomendarProductos,
    traerProductoPorId,
    traerSolicitudesDeAprovacion,
    aceptarProducto,
    rechazarProducto,
    mostrarProductosReportados
};
