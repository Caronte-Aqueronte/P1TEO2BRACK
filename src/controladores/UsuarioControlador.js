const User = require('../modelos/Usuario'); // Importa el modelo User
const sequelize = require('../sequelize'); // Importa la instancia de Sequelize

const crypto = require('crypto');

const login = async (req, res) => {
    try {
        // Verificar si los parámetros son nulos
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({ mensaje: 'Falta correo electrónico o contraseña' });
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

        if (usuarioEncontrado) {
            return res.json({ usuarioEncontrado });
        } else {
            return res.send(null);
        }
    } catch (error) {
        console.error('Error en la autenticación:', error);
        return res.send(null);
    }
}

const createUser = async (req, res) => {
    try {
        // Verificar si los parámetros son nulos
        if (!req.body.email || !req.body.password || !req.body.nombre_usuario
            || !req.body.rol) {
            return res.status(400).json({ mensaje: 'Falta correo electrónico, nombre de usuario, rol o contraseña' });
        }

        var estado_aprobacion = true;
        if (req.body.rol === "vendedor") {
            estado_aprobacion = false;
        }

        // Encriptar la contraseña
        const hashedPassword = crypto.createHash('sha256').update(req.body.password).digest('hex');

        // Crear un nuevo usuario en la base de datos
        const newUser = await User.create({
            email: req.body.email,
            password: hashedPassword,
            nombre_usuario: req.body.nombre_usuario,
            rol: req.body.rol,
            estado_aprobacion: estado_aprobacion
        });

        return res.status(201).json({ mensaje: 'Usuario creado correctamente', usuario: newUser });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        return res.status(500).json({ mensaje: 'Error al crear usuario' });
    }
}

module.exports = {
    login,
    createUser
};
