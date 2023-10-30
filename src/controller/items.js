const ItemsModel = require('../models/items');


exports.getSku = async (req, res) => {
    const body = req
    try {
        const [data] = await ItemsModel.getSku(body)
        res.status(200).json(data[0])
    } catch (error) {
        res.status(400).send(error)
    }
}
exports.getItems = async (req, res) => {
    const branchId = req.user.branch_id
    const body =  {
        branch_id: branchId,
        search: req.query.search
    }
    try {
        const [data] = await ItemsModel.getItems(body)
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send(error)  
    }
}
exports.deleteItem = async (req, res) => {
    const id = req.params.id
    try {
        await ItemsModel.deleteItem(id)
        res.status(200).json('OK')
    } catch (error) {
        res.status(400).send(error)
    }   
}