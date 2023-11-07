const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const IngredientModel = require('../models/ingredients');

exports.getIngredientCategories = async (req, res) => {
    const [data] = await IngredientModel.getIngredientCategories()
    res.status(200).json(data)
}

exports.getAllIngredient = async (req, res) => {
    const body = req.query
    try {
        const data = await IngredientModel.getAllIngredients(body)
        res.status(200).json(data)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
}

exports.insertIngredient = async (req, res) => {
    let fileName = ''
    const data = req.body
    const body = {
        name: data.name,
        ingredient_category_id: JSON.parse(data.ingredient_category_id),
        unit_id: data.unit_id,
        unit_cost: data.unit_cost,
        image: ''
    }
    if(req.file) {
        const filePath = `./public/img/ingredients/${req.file.filename}`
        await sharp(req.file.path)
        .resize({height: 200})
        .toFile(filePath);
        fs.unlinkSync(req.file.path)
        fileName = `public/img/ingredients/${req.file.filename}`;
    }
    try {
        body.image = fileName
        await IngredientModel.insertIngredient(body)
        res.status(200).json('OK')
    } catch (error) {
        res.status(400).send(error)
    }
}

exports.updateIngredient = async (req, res) => {
    let fileName = ''
    const data = req.body
    const body = {
        id: data.id,
        name: data.name,
        ingredient_category_id: JSON.parse(data.ingredient_category_id),
        unit_id: data.unit_id,
        unit_cost: data.unit_cost,
        image: ''

    }
    if(req.file) {
        const filePath = `./public/img/ingredients/${req.file.filename}`
        await sharp(req.file.path)
        .resize({height: 200})
        .toFile(filePath);
        fs.unlinkSync(req.file.path)
        fileName = `public/img/ingredients/${req.file.filename}`;
    }
    try {
        body.image = fileName
        await IngredientModel.updateIngredient(body)
        res.status(200).json('OK')
    } catch (error) {
        res.status(400).send(error)
    }
}