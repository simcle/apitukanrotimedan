const AttendenceModel = require('../models/attendeces');

exports.indexDashboard = (req, res) => {
    const attendeces = AttendenceModel.countAteendenceSatatus()
    Promise.all([
        attendeces
    ])
    .then(result => {
        res.status(200).json({
            attendences: result[0][0][0]
        })
    })
    .catch(err => {
        res.status(400).send(err)
    })
}

exports.getAttendenceByStatus = async (req, res) => {
    const body = req.params.status 
    try {
        const [data] = await AttendenceModel.getAtttendenceByStatus(body)
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send(error)
    }
}