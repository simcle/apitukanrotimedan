const AdjustmentModel = require('../models/adjustmentItems');



exports.getAdjustmentByBranch = async (req, res) => {
    const body = req.user.branch_id
    try {
        const data = await AdjustmentModel.getAdjustmentByBranch(body)
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send(error)
    }
}

exports.insertAdjustment = async (req, res) => {
    const body = {
        items: req.body.items,
        note: req.body.note,
        branch_id: req.user.branch_id,
        user_id: req.user.id
    }

    try {
        const data = await AdjustmentModel.insertAdjustments(body)
        res.status(200).json(data)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
}
