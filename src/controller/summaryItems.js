const SummaryItemsModel = require('../models/summaryItems')
const excel = require('exceljs');
const moment = require('moment');

exports.getAllSummary = async (req, res) => {
    const body = req.query
    try {
        const data = await SummaryItemsModel.getAllSummary(body)
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send(error)   
    }
}

exports.downloadSummary = async (req, res) => {
    const body = req.query
    const start = moment(body.start).format('DD/MM/YYYY')
    const end = moment(body.end).format('DD/MM/YYYY')
    try {
        const data = await SummaryItemsModel.downloadSummary(body)
        let workbook = new excel.Workbook()
        let worksheet = workbook.addWorksheet('Summary Ingredients')
        worksheet.columns = [
            {key: 'outlet_name', width: 20},
            {key: 'item_sku',  width: 10},
            {key: 'item_name', width: 25},
            {key: 'beginning',  width: 10},
            {key: 'incoming',  width: 10},
            {key: 'sales',  width: 10},
            {key: 'adjustment',  width: 10},
            {key: 'ending',  width: 10},
        ]
        worksheet.getRow(1).values = ['Summary Items', `From ${start} To ${end}`]
        worksheet.getRow(3).values = ['Outlet', 'SKU', 'Item', 'Beginning', 'Incoming', 'Sales', 'Adjustment', 'Ending']
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
        res.status(400).send(error)
    }
}