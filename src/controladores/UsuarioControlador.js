const User = require('../modelos/Usuario'); // Importa el modelo User
const sequelize = require('../sequelize'); // Importa la instancia de Sequelize
const { Op } = require('sequelize');
const crypto = require('crypto');

const login = async (req, res) => {
    try {
        // Verificar si los parámetros son nulos
        if (!req.body.email || !req.body.password) {
            return res.json({ bandera: false, mensaje: 'Falta correo electrónico o contraseña' });
        }

        // Encriptar la contraseña
        const hashedPassword = crypto.createHash('sha256').update(req.body.password).digest('hex');

        // Buscar el usuario por correo electrónico y contraseña en la base de datos
        const usuarioEncontrado = await User.findOne({
            where: {
                email: req.body.email,
                password: hashedPassword
            }
        });

        if (!usuarioEncontrado) {
            return res.send({ bandera: false, mensaje: "Credenciales incorrectas." });
        }
        if (usuarioEncontrado.estado_aprobacion === false) {
            return res.json({ bandera: false, mensaje: "Tu usuario no ha sido aprobado." });
        }
        return res.json({ bandera: true, usuarioEncontrado: usuarioEncontrado });
    } catch (error) {
        console.error('Error en la autenticación:', error);
        return res.json({ bandera: false, mensaje: "Error en la identificación" });
    }
}


const aceptarUsuario = async (req, res) => {
    try {
        // Obtener el ID del usuario a aceptar desde los parámetros de la solicitud
        const usuarioId = req.body.id;

        // Verificar si el ID del usuario es nulo o no válido
        if (!usuarioId) {
            return res.json({ bandera: false, mensaje: 'Se requiere proporcionar un ID de usuario válido.' });
        }

        // Buscar el usuario por su ID
        const usuario = await User.findByPk(usuarioId);

        // Verificar si el usuario existe
        if (!usuario) {
            return res.json({ bandera: false, mensaje: 'El usuario especificado no fue encontrado.' });
        }

        // Actualizar el estado de aprobación del usuario
        await usuario.update({ estado_aprobacion: true });

        // Responder con un mensaje de éxito
        return res.json({ bandera: true, mensaje: 'El usuario fue aceptado correctamente.' });
    } catch (error) {
        console.error('Error al intentar aceptar el usuario:', error);
        return res.json({ bandera: false, mensaje: 'Ocurrió un error al intentar aceptar el usuario.' });
    }
}

const eliminarUsuario = async (req, res) => {
    try {
        // Obtener el ID del usuario a eliminar desde los parámetros de la solicitud
        const usuarioId = req.params.id;

        // Verificar si el ID del usuario es nulo o no válido
        if (!usuarioId) {
            return res.json({ bandera: false, mensaje: 'Se requiere proporcionar un ID de usuario válido.' });
        }

        // Buscar el usuario por su ID
        const usuario = await User.findByPk(usuarioId);

        // Verificar si el usuario existe
        if (!usuario) {
            return res.json({ bandera: false, mensaje: 'El usuario especificado no fue encontrado.' });
        }

        // Eliminar el usuario
        await usuario.destroy();

        // Responder con un mensaje de éxito
        return res.json({ bandera: true, mensaje: 'El usuario fue eliminado correctamente.' });
    } catch (error) {
        console.error('Error al intentar eliminar el usuario:', error);
        return res.json({ bandera: false, mensaje: 'Ocurrió un error al intentar eliminar el usuario.' });
    }
}

const traerSolicitudes = async (req, res) => {
    try {
        // Buscar el usuario por correo electrónico y contraseña en la base de datos
        const solis = await User.findAll({
            where: {
                estado_aprobacion: false
            }
        });
        return res.json(solis);
    } catch (error) {
        console.error('Error en la autenticación:', error);
        return res.json([]);
    }
}

const traerUsuarios = async (req, res) => {
    try {
        const userId = req.query.id; // Supongo que tienes la información del usuario que ha iniciado sesión en req.user

        // Buscar todos los usuarios cuyo estado de aprobación sea verdadero, excluyendo al usuario actual
        const usuarios = await User.findAll({
            where: {
                estado_aprobacion: true,
                id: {
                    [Op.ne]: userId // Excluir al usuario actual por su ID
                }
            }
        });

        return res.json(usuarios);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
}
const buscarUsuariosPorNombre = async (req, res) => {
    try {
        // Verificar si los parámetros son nulos
        if (req.query.nombreUsuario === undefined) {
            return res.json([]);
        }
        // Buscar el usuario por correo electrónico y contraseña en la base de datos
        const usuarios = await User.findAll({
            where: {
                nombre_usuario: {
                    [Op.like]: `%${req.query.nombreUsuario}%`
                },
                estado_aprobacion: true,
            }
        }
        );
        return res.json(usuarios);
    } catch (error) {
        console.error('Error en la autenticación:', error);
        return res.json([]);
    }
}

const crearUsuarioNormal = async (req, res) => {
    return res.json(await crearUsuario(req.body.email, req.body.password, req.body.nombre_usuario
        , "usuario", false));
}

const crearUsuarioAdmin = async (req, res) => {
    return res.json(await crearUsuario(req.body.email, req.body.password, req.body.nombre_usuario
        , "admin", true));
}


const crearUsuario = async (email, password, nombre_usuario, rol,
    estado_aprobacion) => {
    try {
        // Verificar si los parámetros son nulos
        if (!email || !password || !nombre_usuario ||
            !rol) {
            return {
                bandera: false,
                mensaje: 'Falta correo electrónico,' +
                    ' nombre de usuario, rol o contraseña'
            };
        }
        // Encriptar la contraseña
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        // Crear un nuevo usuario en la base de datos
        const newUser = await User.create({
            email: email,
            password: hashedPassword,
            nombre_usuario: nombre_usuario,
            rol: rol,
            estado_aprobacion: estado_aprobacion
        });

        if (estado_aprobacion) {
            return { bandera: true, mensaje: 'Usuario creado correctamente', usuario: newUser };
        }
        return { bandera: true, mensaje: 'Usuario creado correctamente, pendiente de aprobación', usuario: newUser };
    } catch (error) {
        console.error('Error al crear usuario:', error);
        return { bandera: false, mensaje: 'Error al crear usuario' };
    }
}

module.exports = {
    login,
    crearUsuarioNormal,
    crearUsuarioAdmin,
    traerSolicitudes,
    traerUsuarios,
    buscarUsuariosPorNombre,
    eliminarUsuario,
    aceptarUsuario
};
