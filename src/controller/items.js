const ItemsModel = require('../models/items');

exports.getItems = async (req, res) => {
    const body = req.query
    try {
        const [data] = await ItemsModel.getItems(body)
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send(error)  
    }
}