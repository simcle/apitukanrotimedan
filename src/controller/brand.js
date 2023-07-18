const BrandModel = require('../models/brand');

exports.searchBrand = async (req, res) => {
    const search = req.query.search
    try {
        const [data] = await BrandModel.searchBrand(search)
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send(error)
    }
}

exports.insertBrand = async (req, res) => {
    const body = req.body
    try {
        const [data] = await BrandModel.insertBrand(body)
        res.status(200).json(data[0])
    } catch (error) {
        res.status(400).send(error)
    }
}