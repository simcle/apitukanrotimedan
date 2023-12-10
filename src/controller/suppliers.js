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

exports.getSupplierByBranch = async (req, res) => {
    const body = {
        branch_id: req.user.branch_id,
        search: req.query.search
    }
    try {
        const [data] = await SupplierModel.getSupplierByBranch(body)
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send(error)
    }

}

exports.insertSuppler = async (req, res) => {
    const body = req.body
    let branch_id = req.user.branch_id
    if(!branch_id) {
        branch_id = 8
    }
    body.branch_id = branch_id
    try {
        const [data] = await SupplierModel.insertSupplier(body)
        res.status(200).json(data[0])
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