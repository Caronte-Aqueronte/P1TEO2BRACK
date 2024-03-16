const User = require('../modelos/Usuario'); // Importa el modelo User
const sequelize = require('../sequelize'); // Importa la instancia de Sequelize

const crypto = require('crypto');

const login = async (req, res) => {
    try {
        // Verificar si los parámetros son nulos
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({ bandera: false, mensaje: 'Falta correo electrónico o contraseña' });
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

const crearUsuarioNormal = async (req, res) => {
    return res.json( await crearUsuario(req.body.email, req.body.password, req.body.nombre_usuario
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

        if(estado_aprobacion){
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
    crearUsuarioAdmin
};
