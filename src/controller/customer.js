const CustomerModel = require('../models/customer');


exports.getAllCustomer = async (req, res) => {
    const body = {
        search: req.query.search,
        branch_id: req.user.branch_id
    }
    try {
        const [data] = await CustomerModel.getAllCustomer(body)
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send(error)
    }
}

exports.insertCustomer = async (req, res) => {
    let body = req.body
    body.user_id = req.user.id
    body.branch_id = req.user.branch_id

    try {
        const [data] = await CustomerModel.insertCustomer(body)
        res.status(200).json(data[0])
    } catch (error) {
        res.status(400).send(error)
    }
}

exports.updateCustomer = async (req, res) => {
    const body = req.body
    try {
        await CustomerModel.updateCustomer(body)
        res.status(200).json('OK')
    } catch (error) {
        res.status(400).send(error)
    }
}