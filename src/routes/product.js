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

const upload = multer({storage: fileStorage});
const productController = require('../controller/product');

router.get('/filter', productController.getFilter);
router.get('/', productController.getAllProduct);
router.post('/', upload.single('image'), productController.insertProduct);
router.put('/', upload.single('image'), productController.updateProduct);

module.exports = router;