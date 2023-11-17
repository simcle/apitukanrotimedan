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

const ingredientController = require('../controller/ingredients');
router.get('/categories', ingredientController.getIngredientCategories);
router.get('/', ingredientController.getAllIngredient);
router.post('/', upload.single('image'), ingredientController.insertIngredient);
router.put('/', upload.single('image'), ingredientController.updateIngredient);
router.delete('/:id', ingredientController.deleteIngredient);

module.exports = router;