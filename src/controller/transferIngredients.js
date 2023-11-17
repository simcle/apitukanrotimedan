const TransferModel = require('../models/transferIngredients');

exports.getAllTransfer = async (req, res) => {
    const body = req.query
    try {
        const data = await TransferModel.getAllTransfer(body)
        res.status(200).json(data)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
}
exports.insertTransfer = async (req, res) => {
    const body = req.body
    body.user_id = req.user.id 
    try {
        const data = await TransferModel.insertTransfer(body)
        res.status(200).json(data)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
}

