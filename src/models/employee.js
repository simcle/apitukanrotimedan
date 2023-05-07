const dbPool = require('../config/database');

const getAllEmployees  = () => {
    const sql =     `SELECT employees.*, merchants.name as merchant, merchants.cloud_id FROM employees LEFT JOIN merchants ON employees.merchant_id = merchants.id ORDER BY employees.name ASC`
    return dbPool.execute(sql)
}
const getEmployee = (id) => {
    const sql = `SELECT employees.*, merchants.name as merchant, merchants.cloud_id FROM employees LEFT JOIN merchants ON employees.merchant_id = merchants.id WHERE employees.id='${id}'`
    return dbPool.execute(sql)
}
const insertEmployee =  (body) => {
    const sql = `INSERT INTO employees (name, nik, tempat_lahir, tanggal_lahir, jenis_kelamin, status_pernikahan, golongan_darah, agama, alamat, mobile_phone, email, posisi_pekerjaan, merchant_id, status_pekerjaan, tanggal_bergabung, gaji_pokok) 
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
        body.name,
        body.nik,
        body.tempatLahir,
        body.tanggalLahir,
        body.jenisKelamin,
        body.statusPernikahan,
        body.golonganDarah,
        body.agama,
        body.alamat,
        body.mobilePhone,
        body.email,
        body.posisiPekerjaan,
        body.merchantId,
        body.statusPekerjaan,
        body.tanggalBergabung,
        body.gajiPokok
    ];
    return dbPool.execute(sql, values)
}

module.exports = {
    getAllEmployees,
    getEmployee,
    insertEmployee,
}