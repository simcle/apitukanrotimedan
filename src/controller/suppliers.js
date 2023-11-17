const SupplierModel = require('../models/suppliers');

exports.getAllSupplier = async (req, res) => {
    const body = req.query
    try {
        const data = await SupplierModel.getAllSupplier(body)
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send(error)
    }
}
 
exports.insertSuppler = async (req, res) => {
    const body = req.body
    try {
        const data = await SupplierModel.insertSupplier(body)
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send(error)
    }
}

exports.updateSupplier = async (req, res) => {
    const body = req.body
    try {
        const data = await SupplierModel.updateSupplier(body)
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send(error)
    }
}