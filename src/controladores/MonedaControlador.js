const Moneda = require('../modelos/Moneda'); // Importa el modelo Compra
const User = require('../modelos/Usuario'); // Importa el modelo Compra
const Retiro = require('../modelos/Retiro'); // Importa el modelo Compra
const sequelize = require('../sequelize'); // Importa la instancia de Sequelize
const { Op } = require('sequelize');

const recargarMonedas = async (req, res) => {
    try {
        // Verificar si los parámetros son nulos
        if (!req.body.ingreso_moneda || !req.body.userId) {
            return res.json({
                bandera: false, mensaje: 'Faltan datos requeridos' +
                    ' para recargar las monedas'
            });
        }

        // Crear una nueva compra en la base de datos
        const recarga = await Moneda.create({
            ingreso_moneda: req.body.ingreso_moneda,
            retirable: true,
            UserId: req.body.userId // Asignar el ID del usuario al producto
        });
        return res.json({ bandera: true, mensaje: 'Recarga hecha correctamente', recarga: recarga });
    } catch (error) {
        console.error(error);
        return res.json({ bandera: false, mensaje: 'Error al crear recargar' });
    }
}

const traerMonedasUsuario = async (req, res) => {
    try {
        // Verificar si el parámetro userId es nulo
        if (!req.query.userId) {
            return res.json({ cantidad_monedas: 0 });
        }
        const cantidad_monedas_ret = await calcularMonedasUsuario(req.query.userId, true);
        const cantidad_monedas_noret = await calcularMonedasUsuario(req.query.userId, false);
        const cantidad_monedas = cantidad_monedas_ret + cantidad_monedas_noret;
        return res.json({ cantidad_monedas });
    } catch (error) {
        return res.json({ cantidad_monedas: 0 });
    }
}

const traerMonedasRetirablesUsuario = async (req, res) => {
    try {
        // Verificar si el parámetro userId es nulo
        if (!req.query.userId) {
            return res.json({ cantidad_monedas: 0 });
        }
        const cantidad_monedas = await calcularMonedasUsuario(req.query.userId, true);
        return res.json({ cantidad_monedas });
    } catch (error) {
        return res.json({ cantidad_monedas: 0 });
    }
}


const retirarMonedas = async (req, res) => {
    try {
        // Verificar si los parámetros son nulos
        if (!req.body.userId || !req.body.cantidadRetiro) {
            return res.json({ bandera: false, mensaje: "Falta el ID de usuario o la cantidad de retiro" });
        }

        const userId = req.body.userId;
        let cantidadRetiro = parseFloat(req.body.cantidadRetiro);

        const cantidad_monedas_ret = await calcularMonedasUsuario(userId, true);

        if (cantidad_monedas_ret <= 0) {
            return res.json({ bandera: false, mensaje: "No hay monedas retirables para este usuario" });
        }

        if (cantidad_monedas_ret < cantidadRetiro) {
            return res.json({ bandera: false, mensaje: "No hay suficientes monedas para retirar la cantidad especificada" });
        }

        if (cantidadRetiro <= 0) {
            return res.json({ bandera: false, mensaje: "No se pueden retirar 0 treboles" });
        }

        // Traer todas las monedas retirables del usuario por su ID y ordenarlas por ID de forma ascendente
        let monedas = await Moneda.findAll({
            where: {
                UserId: userId,
                retirable: true
            },
            order: [['id', 'ASC']]
        });

        // Iterar sobre las monedas retirables y restar la cantidad de retiro
        for (const moneda of monedas) {
            if (cantidadRetiro <= 0) {
                break; // Salir del bucle si ya se retiró toda la cantidad
            }

            // Calcular la cantidad a retirar de esta moneda
            const cantidadARetirarDeEstaMoneda = Math.min(cantidadRetiro, moneda.ingreso_moneda);

            // Restar la cantidad a retirar de esta moneda
            moneda.ingreso_moneda -= cantidadARetirarDeEstaMoneda;
            cantidadRetiro -= cantidadARetirarDeEstaMoneda;

            // Si el saldo de la moneda es cero, eliminarla
            if (moneda.ingreso_moneda <= 0) {
                await moneda.destroy();
            } else {
                // Guardar los cambios en la moneda
                await moneda.save();
            }
        }

        // Guardar la cantidad retirada en la entidad Retiro
        await Retiro.create({
            UserId: userId,
            cantidad_retiro: req.body.cantidadRetiro
        });

        return res.json({ bandera: true, mensaje: "Retiro realizado exitosamente" });
    } catch (error) {
        console.error(error);
        return res.json({ bandera: false, mensaje: "Error al realizar el retiro de monedas" });
    }
}


const calcularMonedasUsuario = async (idUsuario, retirables) => {

    try {
        // Buscar las monedas del usuario por su ID
        const monedas = await Moneda.findAll({
            where: {
                UserId: idUsuario,
                retirable: retirables
            }
        });

        // Verificar si no se encontraron monedas para el usuario
        if (monedas.length === 0) {
            return 0;
        }
        // Sumar las monedas del usuario
        const cantidad_monedas = monedas.reduce((total, moneda) => total + moneda.ingreso_moneda, 0);
        return cantidad_monedas
    } catch (error) {
        return 0;
    }
}




module.exports = {
    recargarMonedas,
    traerMonedasUsuario,
    traerMonedasRetirablesUsuario, retirarMonedas
};