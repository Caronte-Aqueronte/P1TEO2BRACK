const Reporte = require('../modelos/Reporte'); // Importa el modelo Compra
const sequelize = require('../sequelize'); // Importa la instancia de Sequelize
const { Op } = require('sequelize');

const crearReporte = async (req, res) => {
    try {
        // Verificar si los parámetros son nulos
        if (req.body.idProd === undefined || req.body.motivo === undefined) {
            return res.json({
                bandera: false,
                mensaje: 'Faltan datos requeridos para reportar la publicación'
            });
        }

        // Crear un nuevo reporte en la base de datos
        const nuevoReporte = await Reporte.create({
            ProductoId: req.body.idProd,
            motivo_reporte: req.body.motivo
        });
        if (nuevoReporte) {
            return res.json({
                bandera: true,
                mensaje: 'Reporte creado correctamente',
                reporte: nuevoReporte
            });
        }
        return res.json({
            bandera: false,
            mensaje: 'No se pudo crear el reporte'
        });

    } catch (error) {
        console.error(error);
        return res.json({
            bandera: false,
            mensaje: 'Error al crear el reporte'
        });
    }
}

const eliminarReportesPorPublicacion = async (req, res) => {
    try {
        // Verificar si el parámetro es nulo
        if (!req.params.id) {
            return res.json({ bandera: false, mensaje: 'Falta el ID de la publicación' });
        }

        // Eliminar todos los reportes asociados a la publicación
        const cantidadEliminada = await Reporte.destroy({
            where: {
                ProductoId: req.params.id
            }
        });

        return res.json({ 
            bandera: true, 
            mensaje: `Se eliminaron ${cantidadEliminada} reportes asociados a la publicación con ID ${req.params.id}` 
        });
    } catch (error) {
        console.error('Error al eliminar reportes por publicación:', error);
        return res.json({ bandera: false, mensaje: 'Error al eliminar reportes por publicación' });
    }
};

module.exports = {
    crearReporte,
    eliminarReportesPorPublicacion,
};