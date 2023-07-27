require('dotenv').config()
const EmployeeModel = require('../models/employee');
const BranchesModel = require('../models/branches');
const AttendenceModel = require('../models/attendeces');
const moment = require('moment');
const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendEmail = require('../config/mailer');
const apiToken = process.env.API_TOKEN

exports.getAllEmployee = async (req, res) => {
    try {
        const [data] = await EmployeeModel.getAllEmployee();
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send(error)
    }
}

exports.undangEmployee = async (req, res) => {
    const body = []
    for (let i = 0; i < req.body.employees.length; i++) {
        const user = req.body.employees[i]
        const hashPassword = await bcrypt.hash(user.password, 10);
        body.push({id: user.id, password: hashPassword})
    }
    try {
        await EmployeeModel.undangEmployee(body)
        res.status(200).json('OK')
    } catch (error) {
        res.status(400).send(error)
    }
}

exports.deleteEmployeeUser = async (req, res) => {
    const id = req.params.id
    try {
        await EmployeeModel.deleteEmployeeUser(id)
        res.status(200).json('OK')
    } catch (error) {
        res.status(400).send(error)
    }
}
exports.inviteEmployee = async (req, res) => {
    try {
        const [data] = await EmployeeModel.inviteEmployee()
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send(error)
    }
}
exports.sendInviteEmployee = async(req, res) => {
    const employees = req.body.employees
    try {
        for (let i = 0; i < employees.length; i++) {
            const id = employees[i].id
            const name = employees[i].name
            const email = employees[i].email
            const token = jwt.sign({id: id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'})
            const templateEmail = {
                from: '"ROSCO NAULI BAKERY" <admin@tukangrotimedan.com>',
                to: email,
                subject: 'Invite User',
                html: `
                    <p>Dear ${name}</p>
                    <p>Anda menerima undangan dari Admin ROSCO NAULI BAKERY untuk menjadi user. Untuk menerima undang ini silahkan klik link dibawah ini</p>
                    <p>${process.env.CLIENT_URL}/resetPassword/${token}</p>
                `
            }
            await sendEmail(templateEmail)
        }
        res.status(200).json('OK')
    } catch (error) {
        res.status(400).send(error)   
    }
    
}
exports.getEmployee = async (req, res) => {
    const id = req.params.id
    try {
        const [data] = await EmployeeModel.getEmployee(id)
        res.status(200).json(data[0])
    } catch (error) {
        res.status(400).send(error)
    }
}

exports.createEmployee = async (req, res) => {
    try {
        const [data] = await BranchesModel.getAllBranch();
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send(error)
    }
}

exports.insertEmployee = async (req, res) => {
    const body = req.body
    if(body.tanggalLahir) {
        let tanggalLahir = moment(body.tanggalLahir).format('YYYY-MM-DD')
        body.tanggalLahir = tanggalLahir
    }
    if(body.tanggalBergabung) {
        let tanggalBergabung = moment(body.tanggalBergabung).format('YYYY-MM-DD')
        body.tanggalBergabung = tanggalBergabung
    }
    try {
        const [result] = await EmployeeModel.insertEmployee(body)
        const id = result.insertId
        let  [data] = await EmployeeModel.getEmployee(id)
        data = data[0]
        if(data.cloud_id) {
            data = {
                trans_id: data.id,
                cloud_id: data.cloud_id,
                data: {
                    pin: data.id,
                    name: data.name,
                    privilege: 1,
                    password: '',
                    template: ''
                }
            }
            await axios.post('http://developer.fingerspot.io/api/set_userinfo', data, {
                headers: {
                    Authorization: `Bearer ${apiToken}`
                }
            })
        }
        res.status(200).json({id: id})
    } catch (error) {
        res.status(400).send(error)
    }
}

exports.updateEmployee = async (req, res) => {
    const body = req.body
    if(body.tanggalLahir) {
        let tanggalLahir = moment(body.tanggalLahir).format('YYYY-MM-DD')
        body.tanggalLahir = tanggalLahir
    }
    if(body.tanggalBergabung) {
        let tanggalBergabung = moment(body.tanggalBergabung).format('YYYY-MM-DD')
        body.tanggalBergabung = tanggalBergabung
    }
    try {
        await EmployeeModel.updateEmployee(body)
        if(body.cloudId) {
            let data = {
                trans_id: body.id,
                cloud_id: body.cloudId,
                data: {
                    pin: body.id,
                    name: body.name,
                    privilege: 1,
                    password: '',
                    template: `${body.template}`
                }
            }
            axios.post('https://developer.fingerspot.io/api/set_userinfo', data, {
                headers: {
                    Authorization: `Bearer ${apiToken}`
                }
            })
        }
        res.status(200).json('OK')
    } catch (error) {
        res.status(400).send(error)   
    }
}

exports.getAttendence = async (req, res) => {
    const id = req.params.id;
    const body =  req.query
    try {
        const data = await AttendenceModel.getUserAttendence(id, body)
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send(error)
    }
}

exports.fingerPrint = (req, res) => {
    const data = {
        trans_id: req.body.id,
        cloud_id: req.body.cloudId,
        pin: req.body.id,
        verification: 0
    }
    axios.post('https://developer.fingerspot.io/api/reg_online', data, {
        headers: {
            Authorization: `Bearer ${apiToken}`
        }
    })
    .then(result => {
        res.status(200).json(result.data);
    })
}

exports.resignEmployee = async (req, res) => {
    const body = req.body
    let tanggal_keluar = moment().format('YYYY-MM-DD')
    body.tanggal_keluar = tanggal_keluar
    try {
        await EmployeeModel.resign(body)
        res.status(200).json('OK')
    } catch (error) {
        res.status(400).send(error)
    }
}

exports.activateEmployee = async (req, res) => {
    const body = req.body
    try {
        await EmployeeModel.activate(body)
        res.status(200).json('OK')
    } catch (error) {
        res.status(400).send(error)
    }
}

exports.deleteEmployee = async (req, res) => {
    const id = req.params.id
    try {
       const [user] = await EmployeeModel.getEmployee(id)
       const data = {
        trans_id: id,
        cloud_id: user[0].cloud_id,
        pid: id
       } 
       await EmployeeModel.deleteEmployee(id)

        axios.post('https://developer.fingerspot.io/api/reg_online', data, {
            headers: {
                Authorization: `Bearer ${apiToken}`
            }
        })
        .then(result => {
            res.status(200).json(result.data);
        })
    } catch (error) {
        
    }
}