const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const ProdcutModel = require('../models/product');

exports.getFilter = async (req, res) => {
    try {
        const data = await ProdcutModel.getFilter()
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send(error)
    }
}

exports.getAllProduct = async (req, res) => {
    const body = req.query
    try {
        const data = await ProdcutModel.getAllProduct(body)
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send(error)
    }
}
exports.insertProduct = async (req, res) => {
    let fileName = ''
    const data = req.body
    const body = {
        name: data.name,
        brand_id: JSON.parse(data.brand_id),
        category_id: JSON.parse(data.category_id),
        description: data.description,
        image: '',
        item_variants: JSON.parse(data.item_variants)
    }

    if(req.file) {
        const filePath = `./public/img/products/${req.file.filename}`
        await sharp(req.file.path)
        .resize({height: 200})
        .toFile(filePath);
        fs.unlinkSync(req.file.path)
        fileName = `public/img/products/${req.file.filename}`;
    }
    try {
        body.image = fileName
        await ProdcutModel.insertProduct(body)
        res.status(200).json('OK')
    } catch (error) {
        res.status(400).send(error)
    }
}

exports.updateProduct = async (req, res) => {
    let fileName = ''
    const data = req.body
    const body = {
        id: data.id,
        name: data.name,
        brand_id: JSON.parse(data.brand_id),
        category_id: JSON.parse(data.category_id),
        description: data.description,
        image: '',
        item_variants: JSON.parse(data.item_variants)
    }
    if(req.file) {
        const filePath = `./public/img/products/${req.file.filename}`
        await sharp(req.file.path)
        .resize({height: 200})
        .toFile(filePath);
        fs.unlinkSync(req.file.path)
        fileName = `public/img/products/${req.file.filename}`;
    }
    try {
        body.image = fileName
        await ProdcutModel.updateProduct(body)
        res.status(200).json('OK')
    } catch (error) {
        res.status(400).send(error)
    }
}

