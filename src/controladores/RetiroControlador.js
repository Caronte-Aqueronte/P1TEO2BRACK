const Retiro = require('../modelos/Retiro'); // Importa el modelo Compra
const sequelize = require('../sequelize'); // Importa la instancia de Sequelize
const { Op } = require('sequelize');

const traerRetirosDelUsuario = async (req, res) => {
    try {
        // Verificar si el parámetro userId es nulo
        if (!req.query.userId) {
            return res.json({ cantidad_monedas: 0 });
        }
        const cantidad_monedas = await calcularTotalRetiros(req.query.userId);
        return res.json({ cantidad_monedas });
    } catch (error) {
        return res.json({ cantidad_monedas: 0 });
    }
}

const calcularTotalRetiros = async (idUsuario) => {

    try {
        // Buscar las monedas del usuario por su ID
        const retiros = await Retiro.findAll({
            where: {
                UserId: idUsuario,
            }
        });

        // Verificar si no se encontraron monedas para el usuario
        if (retiros.length === 0) {
            return 0;
        }
        // Sumar las monedas del usuario
        const cantidad_monedas = retiros.reduce((total, retiro) => total + retiro.cantidad_retiro, 0);
        return cantidad_monedas
    } catch (error) {
        return 0;
    }
}





module.exports = {
    traerRetirosDelUsuario,
};