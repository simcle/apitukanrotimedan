const CompaniesModel = require('../models/company');

exports.getCompany = async (req, res) => {
    try {
        const [data] = await CompaniesModel.getCompany()
        res.status(200).json(data[0])
    } catch (error) {
        res.status(400).send(error)
    }
}

exports.uploadCompanyLogo = (req, res) => {
    res.status(201).json({img: req.file.path});
}

exports.insertCompany = async (req, res) => {
    const body = req.body
    try {
        const [data] = await CompaniesModel.getCompany()
        if(data.length == 0) {
            await CompaniesModel.insertCompany(body)
            res.status(200).json('OK')
        } else {
            await CompaniesModel.updateCompany(body)
            res.status(200).json('OK')
        }
    } catch (error) {
        res.status(400).send(error)   
    }
}