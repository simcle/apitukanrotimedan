const IncomingModel = require('../models/incomingItems');

exports.getItems = async (req, res) => {
    const body = {
        branch_id: req.user.branch_id,
        search: req.query.search
    }
    try {
        const data = await IncomingModel.getItems(body)
        res.status(200).json(data)
    } catch (error) {
        console.log(error)   
        res.status(400).send(error)
    }
}

exports.getIncoming = async (req, res) => {
    const body = req.query
    body.branch_id = req.user.branch_id
    try {
        const data = await IncomingModel.getIncoming(body)
        res.status(200).json(data)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
}

exports.insertIncoming = async (req, res) => {
    const body = {
        branch_id: req.user.branch_id,
        user_id: req.user.id,
        note: req.body.note,
        items: req.body.items
    }

    try {
        const data = await IncomingModel.insertIncoming(body)
        res.status(200).json(data)
    } catch (error) {
        console.log(error)
    }
}