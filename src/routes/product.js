const express = require('express');
const multer = require('multer');
const uuid = require('uuid');
const router = express.Router();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img/temp');
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `${uuid.v1()}.${ext}`);
    }
});

const importStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/file')
    },
    filename: (req, file, cb) => {
        cb(null, 'item.csv')
    }
})
const upload = multer({storage: fileStorage});
const fileImport = multer({storage: importStorage});
const productController = require('../controller/product');

router.get('/filter', productController.getFilter);
router.get('/', productController.getAllProduct);
router.get('/detail/:id', productController.getDetailProduct);
router.post('/', upload.single('image'), productController.insertProduct);
router.put('/', upload.single('image'), productController.updateProduct);
router.post('/import', fileImport.single('file'), productController.fileImport);
router.get('/export', productController.exportProduct);

module.exports = router;