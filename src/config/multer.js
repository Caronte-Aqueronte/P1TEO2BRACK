const multer = require("multer");
const path = require("path");


//manejos de la imagen
const storage = multer.diskStorage({
    destination:(req, file, cb) =>{
        cb(null, path.join(__dirname, '../upload'))
    },
    filename: (req, file, cb)=>{
        cb(null, `${file.fieldname} - ${Date.now()}.${file.mimetype.split('/')[1]}`)
    }
});

module.exports = storage;