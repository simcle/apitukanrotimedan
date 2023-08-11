const AttendenceModel = require('../models/attendeces');
const SalesModel = require('../models/sales');

exports.indexDashboard = (req, res) => {
    const attendeces = AttendenceModel.countAteendenceSatatus()
    const summarySales = SalesModel.summarySales()
    Promise.all([
        attendeces,
        summarySales
    ])
    .then(result => {
        res.status(200).json({
            attendences: result[0][0][0],
            sales: result[1]
        })
    })
    .catch(err => {
        console.log(err)
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