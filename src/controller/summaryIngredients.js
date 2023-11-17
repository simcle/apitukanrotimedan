const SummaryIngredientModel = require('../models/summaryIngredients');

exports.getAllSummary = async (req, res) => {
    const body = req.query
    try {
        const data = await SummaryIngredientModel.getAllSummary(body)
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send(error)   
    }
}