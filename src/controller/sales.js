const SalesModel = require('../models/sales');
const excel = require('exceljs');
const moment = require('moment');
exports.getAllSales = async (req, res) => {
    const body = req.query
    try {
        const data = await SalesModel.getAllsales(body)
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send(error)
    }
}
exports.downloadSales = async (req, res) => {
    const body = req.query
    const start = moment(body.start).format('DD/MM/YYYY')
    const end = moment(body.end).format('DD/MM/YYYY')
    try {
        const [data] = await SalesModel.downloadSales(body)
        // EXCEL
        let workbook = new excel.Workbook()
        let worksheet = workbook.addWorksheet('Laporan Penjualan')
        worksheet.columns = [
            {key: 'created_at', width: 15},
            {key: 'outlet', width: 20},
            {key: 'sales_no',  width: 20},
            {key: 'customer',  width: 25},
            {key: 'kasir',  width: 20},
            {key: 'total',  width: 15},
            {key: 'payment_method',  width: 15},
        ]
        worksheet.getColumn(6).numFmt= '#,##0'
        worksheet.getRow(1).values = ['Laporan Penjualan', `dari ${start} sampai ${end}`]
        worksheet.getRow(3).values = ['Tanggal', 'Outlet', 'Transaksi', 'Pembeli', 'Kasir', 'Pembayaran', '']
        worksheet.addRows(data)
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + "tutorials.xlsx"
        );
        await workbook.xlsx.write(res);
        res.status(200).end();

    } catch (error) {
        console.log(error)
    }
}
exports.getDraft = async (req, res) => {
    const body = req.user.branch_id
    try {
        const data = await SalesModel.getDraft(body)
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send(error)
    }
}
exports.getSalesByBranch = async (req, res) => {
    const body = req.user.branch_id
    try {
        const data = await SalesModel.getSalesBayBranch(body)
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


