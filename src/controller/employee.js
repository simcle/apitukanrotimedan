const EmployeesModel = require('../models/employee');
const MerchantModel = require('../models/merchant');
const moment = require('moment');

exports.getAllEmployees = async (req, res) => {
    try {
        const [data] = await EmployeesModel.getAllEmployees()
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send(error)
    }
}

exports.createEmplloye = async (req, res) => {
    try {
        const [data] = await MerchantModel.getAllMerchants()
        res.status(200).json(data);
    } catch (error) {
        res.status(400).send(error)
    }
}

exports.insertEmployees = async (req, res) => {
    const body = req.body
    if(body.tanggalLahir) {
        const tanggalLahir = moment(body.tanggalLahir).format('YYYY-MM-DD')
        body.tanggalLahir = tanggalLahir
    }
    if(body.tanggalBergabung) {
        const tanggalBergabung = moment(body.tanggalBergabung).format('YYYY-MM-DD')
        body.tanggalBergabung= tanggalBergabung
    }
    try {
        const [row] = await EmployeesModel.insertEmployee(body)
        const id = row.insertId
        const [data] = await EmployeesModel.getEmployee(id)
        res.status(200).json(data[0])
    } catch (error) {
        res.status(400).send(error)
    }
}