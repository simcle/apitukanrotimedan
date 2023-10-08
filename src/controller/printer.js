const PrinterModel = require('../models/printer');

exports.insert = async (req, res) => {
    const data = req.body
    const branch_id = req.user.branch_id
    const body = {
        name: data.name,
        address: data.address,
        branch_id: branch_id
    }
    try {
        await PrinterModel.insertOrUpdate(body)
        res.status(200).json('OK')
    } catch (error) {
        res.status(400).send(error)
    }
}

exports.getPrinter = async (req, res) => {
    const boyd = req.user.branch_id
    try {
        const [data] = await PrinterModel.getPrinter(boyd)
        if(data.length > 0) {
            res.status(200).json(data[0])
        } else {
            res.status(200).json(null)
        }
    } catch (error) {
        res.status(400).send(error)
    }
}