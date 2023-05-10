const UserModel = require('../models/users');

exports.getAlluser = async (req, res) => {
    try {
        const [data] = await UserModel.getAllusers()
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send(err)
    }
}


