const ReceipeModel = require('../models/receipes');

exports.getItems = async (req, res) => {
    const body = {
        search: req.query.search
    }
    try {
        const data = await ReceipeModel.getItems(body)
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send(error)
    }
}

exports.getIngredients = async (req, res) => {
    const body = {
        search: req.query.search
    }
    try {
        const data = await ReceipeModel.getIngredients(body)
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send(error)
    }
}

exports.getAllReceipes = async (req, res) => {
    const body = {
        page: req.query.page,
        search: req.query.search
    }
    try {
        const data = await ReceipeModel.getAllReceipes(body)
        res.status(200).json(data)
    } catch (error) {
        console.log(error)
    }
}

exports.insertReceipes = async (req, res) => {
    const body = req.body
    try {
        await ReceipeModel.insertReceipes(body)
        res.status(200).json('OK')
    } catch (error) {
        res.status(400).send(error)
    }
}

exports.updateReceipes = async (req, res) => {
    const body = req.body
    try {
        const data = await ReceipeModel.updateReceipes(body)
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send(error)
    }
}
