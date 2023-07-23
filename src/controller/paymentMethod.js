const PaymentMethodModel = require('../models/paymentMethod');


exports.getAllPaymentMethod = async (req, res) => {
    try {
        const [data] = await PaymentMethodModel.getAllPaymentMethod()
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send(error)
    }
}
exports.insertPaymetnMethod = async (req, res) => {
    const body = req.body
    try {
        const [data] = await PaymentMethodModel.insertPaymentMethod(body)
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send(error)
    }
}

exports.updatePaymentMethod = async (req, res) => {
    const body = req.body
    try {
        const [data] = await PaymentMethodModel.updatePaymentMethod(body)
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send(error)
    }
}