const PurchasingModel = require('../models/purchasing');

exports.getIngredients = async (req, res) => {
    let branch_id = req.user.branch_id
    if(!branch_id) {
        branch_id = 8
    }
    const body = {
        search: req.query.search,
        branch_id: branch_id
    }
    try {
        const data = await PurchasingModel.getIngredients(body)
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send(error)
    }
}

exports.getAllSupplier = async (req, res) => {
    try {
        const [data] = await PurchasingModel.getAllSupplier()
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send(error);
    }
}

exports.getAllPurchasing = async (req, res) => {
    const body = req.query
    try {
        const data = await PurchasingModel.getAllPurchasing(body)
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send(error)
    }
}

exports.getPurchasingByBranch = async (req, res) => {
    const body = req.query
    body.branch_id = req.user.branch_id
    try {
        const data = await PurchasingModel.getPurchasingByBranch(body)
        res.status(200).json(data)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
}
exports.insertPurchasing = async (req, res) => {
    const branch_id = req.user.branch_id
    const body = req.body
    if(branch_id) {
        body.branch_id = branch_id
    } else {
        body.branch_id = 8
    }
    try {
        const data = await PurchasingModel.insertPurchasing(body)
        res.status(200).json(data)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
}

exports.updatePurchasing = async (req, res) => {
    const body = req.body
    try {
        const data = await PurchasingModel.updatePurchasing(body)
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send(error)
    }
}

exports.cancelPurchasing = async (req, res) => {
    const body = req.params.id
    try {
        const data = await PurchasingModel.cancelPurchasing(body)
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send(error)
    }
}