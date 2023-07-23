const SalesModel = require('../models/sales');

exports.getDraft = async (req, res) => {
    const body = req.user.branch_id
    try {
        const data = await SalesModel.getDraft(body)
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send(error)
    }
}
exports.insertSales = async (req, res) => {
    const branch_id = req.user.branch_id
    const user_id = req.user.id
    try {
        const body = {
            sales_no: req.body.sales_no,
            items: req.body.items,
            customer_id: req.body.customer_id,
            customer: req.body.customer,
            total: req.body.total,
            payment_method: req.body.payment_method,
            payment_amount: req.body.payment_amount,
            bank_id: req.body.bank_id,
            change_amount: req.body.change_amount,
            status: req.body.status,
            branch_id: branch_id,
            user_id: user_id
        }
        await SalesModel.insertSales(body)
        res.status(200).json('OK')
    } catch (error) {
        res.status(400).send(error)
    }
}

exports.updateSales = async (req, res) => {
    const body = req.body
    try {
        await SalesModel.updateSales(body)
        res.status(200).json('OK')
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
}

exports.deleteSales = async (req, res) => {
    const id = req.params.id
    try {
        await SalesModel.deleteSales(id)
        res.status(200).json('OK')
    } catch (error) {
        res.status(400).send(error)
    }
}


