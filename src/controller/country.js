const CountryModel = require('../models/country');

exports.getAllProvinces = async (req, res) => {
    try {
        const [data] = await CountryModel.getAllProvinces()
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send(error);
    }
}

exports.getCities = async (req, res) => {
    const provinceId = req.query.provinceId
    try {
        const [data] = await CountryModel.getCities(provinceId)
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send(error);
    }
}

exports.getSubdistricts = async (req, res) => {
    const cityId = req.query.cityId
    try {
        const [data] = await CountryModel.getSubdistricts(cityId)
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send(error)
    }
}