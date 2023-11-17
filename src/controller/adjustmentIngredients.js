const AdjustmentModel = require('../models/adjustmentIngredients');

exports.getAllAdjustments = async (req, res) => {
    const body = req.query
    try {
        const data = await AdjustmentModel.getAllAdjustment(body)
        res.status(200).json(data)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
}

exports.insertAdjustment = async (req, res) => {
    const body = req.body
    let branch_id; 
    let user_id;
    if(req.user.branch_id) {
        branch_id = req.user.branch_id
    } else {
        branch_id = 8
    }
    user_id = req.user.id
    body.branch_id = branch_id
    body.user_id = user_id
    try {
        await AdjustmentModel.insertAdjustments(body)
        res.status(200).json('OK')
    } catch (error) {
        res.status(400).send(error)
    }
}