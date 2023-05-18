const AttendenceModel = require('../models/attendeces')
const excel = require('exceljs');
const moment = require('moment');


exports.getAttendence = async (req, res) => {
    const body = req.query
    try {
        const [data] = await AttendenceModel.getAttendences(body)
        res.status(200).json(data) 
    } catch (error) {
        res.status(400).send(error)
    }
}
exports.reportAttendence = async (req, res) => {
    const body = req.query
    try {
        const data = await AttendenceModel.getReport(body)
        res.status(200).json(data)
    } catch (error) {
        res.status(400).send(error)
    }
}
exports.downloadAttendence = async (req, res) => {
    const body = req.query
    const start = moment(body.start).format('DD/MM/YYYY')
    const end = moment(body.end).format('DD/MM/YYYY')
    const [data] = await AttendenceModel.downloadReport(body)
     // EXCEL
     let workbook = new excel.Workbook()
     let worksheet = workbook.addWorksheet('Laporan')
     worksheet.columns = [
         {key: 'scan_date', width: 25},
         {key: 'name', width: 25},
         {key: 'cabang',  width: 25},
         {key: 'time_in',  width: 10},
         {key: 'time_out',  width: 10},
         {key: 'status',  width: 10},
     ]
     worksheet.getRow(1).values = ['Laporan absensi', `dari ${start} sampai ${end}`]
     worksheet.getRow(3).values = ['Tanggal', 'Nama karywan', 'Cabang', 'Jam masuk', 'Jam pulang', 'Keterangan']
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
}
exports.updateAttendence = async (req, res) => {
    const body = req.body
    try {
        await AttendenceModel.updateAttendence(body)
        res.status(200).json('OK')
    } catch (error) {
        res.status(400).send(error)
    }
}


