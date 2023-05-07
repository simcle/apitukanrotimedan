const MerchantsModel = require('../models/merchant');

exports.getMerchants =  async (req, res) => {
    try {
        const [data] = await MerchantsModel.getAllMerchants()
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send(error)
    }
}

exports.insertMerchant = async (req, res) => {
    const body = req.body
    try {
        await MerchantsModel.insertMerchant(body)
        res.status(200).json('OK')
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
}

exports.updateMerchant = async (req, res) => {
    const body = req.body
    try {
        await MerchantsModel.updateMerchant(body)
        res.status(200).json('OK')
    } catch (error) {
        res.status(400).send(error)
    }
}