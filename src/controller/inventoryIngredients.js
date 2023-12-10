const InventoryIngredientModel = require('../models/inventoryIngredient');

exports.getAllIngredients = async (req, res) => {
    const body = {
        branch_id: req.user.branch_id,
        search: req.query.search
    }

    try {
        const data = await InventoryIngredientModel.getIngredient(body)
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send(error)
    }
}