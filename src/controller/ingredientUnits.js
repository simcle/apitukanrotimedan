const CategoryModel = require('../models/ingredientUnits');


exports.searchCategory = async (req, res) => {
    const search = req.query.search
    try {
        const [data] = await CategoryModel.searchCategory(search)
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send(error)
    }
}

exports.insertCategory = async (req, res) => {
    const body = req.body
    try {
        const [data] = await CategoryModel.insertCategory(body)
        res.status(200).json(data[0])
    } catch (error) {
        res.status(400).send(error)
    }
}