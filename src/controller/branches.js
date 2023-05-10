const BranchModel = require('../models/branches');

exports.getBranches =  async (req, res) => {
    try {
        const [data] = await BranchModel.getAllBranch()
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send(error)
    }
}

exports.insertBranch = async (req, res) => {
    const body = req.body
    try {
        await BranchModel.insertBranch(body)
        res.status(200).json('OK')
    } catch (error) {
        res.status(400).send(error)
    }
}

exports.updateBranch = async (req, res) => {
    const body = req.body
    try {
        await BranchModel.updateBranch(body)
        res.status(200).json('OK')
    } catch (error) {
        res.status(400).send(error)
    }
}