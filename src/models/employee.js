const dbPool = require('../config/database');
const moment = require('moment');

const getAllEmployee = () => {
    const sql = `SELECT users.*, branches.name as cabang, branches.cloud_id FROM users RIGHT JOIN branches ON users.branch_id=branches.id WHERE users.is_admin=false`;
    return dbPool.execute(sql)
}

const inviteEmployee = () => {
    const sql = `SELECT users.*, branches.name as cabang FROM users RIGHT JOIN branches on users.branch_id=branches.id WHERE is_auth=false`;
    return dbPool.execute(sql)
}

const getEmployee = (id) => {
    const sql = `SELECT users.*, branches.name as cabang, branches.cloud_id FROM users RIGHT JOIN branches ON users.branch_id=branches.id WHERE users.id='${id}'`
    return dbPool.execute(sql)
}
const insertEmployee = (body) => {
    const sql = `INSERT INTO users (
        name,
        email,
        mobile_phone,
        nik_ktp,
        tempat_lahir,
        tanggal_lahir,
        jenis_kelamin,
        status_pernikahan,
        golongan_darah,
        agama,
        alamat,
        branch_id,
        role,
        status_pekerjaan,
        tanggal_bergabung,
        gaji_pokok
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    const values = [
        body.name,
        body.email,
        body.mobilePhone,
        body.nik,
        body.tempatLahir,
        body.tanggalLahir,
        body.jenisKelamin,
        body.statusPernikahan,
        body.golonganDarah,
        body.agama,
        body.alamat,
        body.branchId,
        body.posisiPekerjaan,
        body.statusPekerjaan,
        body.tanggalBergabung,
        body.gajiPokok
    ];
    return dbPool.execute(sql, values)
}

const updateEmployee = (body) => {
    const sql = `UPDATE users SET name=?, email=?, mobile_phone=?, nik_ktp=?, tempat_lahir=?, tanggal_lahir=?, jenis_kelamin=?, 
    status_pernikahan=?, golongan_darah=?, agama=?, alamat=?, role=?, status_pekerjaan=?, tanggal_bergabung=?, gaji_pokok=? WHERE id=?`
    const values = [
        body.name,
        body.email,
        body.mobilePhone,
        body.nik,
        body.tempatLahir,
        body.tanggalLahir,
        body.jenisKelamin,
        body.statusPernikahan,
        body.golonganDarah,
        body.agama,
        body.alamat,
        body.posisiPekerjaan,
        body.statusPekerjaan,
        body.tanggalBergabung,
        body.gajiPokok,
        body.id
    ]
    return dbPool.execute(sql, values)
}

const updateTemplate = (body) => {
    const sql = `UPDATE users SET template=? WHERE id= ?`;
    const values = [
        body.template,
        body.id
    ];
    return dbPool.execute(sql, values)
}
const resign = (body) => {
    const sql = `UPDATE users SET is_auth=?, is_active=?, tanggal_keluar=?, updated_at=? WHERE id='${body.id}'`
    const updatedAt = moment().utc().format('YYYY-MM-DD hh:mm:ss')
    const values = [
        false,
        false,
        body.tanggal_keluar,
        updatedAt
    ]
    return dbPool.execute(sql, values)
}

const activate = (body) => {
    const sql = `UPDATE users SET is_active=?, updated_at=? WHERE id='${body.id}'`
    const updatedAt = moment().utc().format('YYYY-MM-DD hh:mm:ss')
    const values = [
        true,
        updatedAt
    ]
    return dbPool.execute(sql, values)
}

const deleteEmployee = async (id) => {
    let sql = `DELETE FROM attendences WHERE user_id='${id}'`
    await dbPool.execute(sql)
    sql = `DELETE FROM users WHERE id=${id}`
    return dbPool.execute(sql)
}
module.exports = {
    getAllEmployee,
    inviteEmployee,
    getEmployee,
    insertEmployee,
    updateEmployee,
    updateTemplate,
    resign,
    activate,
    deleteEmployee
}