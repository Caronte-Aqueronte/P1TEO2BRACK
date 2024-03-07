const Tag = require('../modelos/Tag'); // Importa el modelo User
const sequelize = require('../sequelize'); // Importa la instancia de Sequelize

const crearTag = async (req, res) => {
    try {
        // Verificar si los parámetros son nulos
        if (!req.body.nombre_tag || !req.body.userId) {
            return res.json({ bandera: false, mensaje: 'Faltan datos requeridos para crear el tag' });
        }

        // Crear un nuevo producto en la base de datos
        const nuevoTag = await Tag.create({
            nombre_tag: req.body.nombre_tag,
            UserId: req.body.userId // Asignar el ID del usuario al producto
        });
        return res.json({ bandera: true, mensaje: 'Tag creado correctamente', producto: nuevoTag });
    } catch (error) {
        return res.json({ bandera: false, mensaje: 'Error al crear el Tag' });
    }
}

const traerTodosLosTags = async (req, res) => {
    try {
        // Buscar tags en función del ID del usuario
        const tagsDisp = await Tag.findAll();
        return res.json({ tags: tagsDisp });
    } catch (error) {
        console.log(error)
        return res.json([]);
    }
}

const traerTagsDeUnUsuario = async (req, res) => {
    try {
        // Verificar si el parámetro userId es nulo
        if (!req.query.userId) {
            return res.json([]);
        }

        // Buscar tags en función del ID del usuario
        const tagsUsuario = await Tag.findAll({
            where: {
                UserId: req.query.userId
            }
        });

        return res.json({ tags: tagsUsuario });
    } catch (error) {
        console.log(error)
        return res.json([]);
    }
}

const eliminarTagPorId = async (req, res) => {
    try {
        // Obtener el ID del tag a eliminar desde los parámetros de la solicitud
        const tagId = req.params.id;

        // Verificar si el ID del tag es nulo o no válido
        if (!tagId) {
            return res.json({ bandera: false, mensaje: 'Se requiere proporcionar un ID de tag válido.' });
        }

        // Buscar el tag por su ID
        const tag = await Tag.findByPk(tagId);

        // Verificar si el tag existe
        if (!tag) {
            return res.json({ bandera: false, mensaje: 'El tag especificado no fue encontrado.' });
        }

        // Eliminar el tag
        await tag.destroy();

        // Responder con un mensaje de éxito
        return res.json({ bandera: true, mensaje: 'El tag fue eliminado correctamente.' });
    } catch (error) {
        console.error('Error al intentar eliminar el tag:', error);
        return res.json({ bandera: false, mensaje: 'Ocurrió un error al intentar eliminar el tag.' });
    }
}

module.exports = {
    crearTag,
    traerTagsDeUnUsuario,
    eliminarTagPorId,
    traerTodosLosTags
};
