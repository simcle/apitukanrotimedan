const dbPool = require('../config/database');
const moment = require('moment')

const getAllMerchants = () => {
    const sql = `SELECT * FROM merchants ORDER BY name ASC`
    return dbPool.execute(sql)
}

const insertMerchant = (body) => {
    const sql = `INSERT INTO merchants (name, address, mobile, cloud_id) 
        VALUES(?, ?, ?, ?)
    `
    const values = [
        body.name,
        body.address,
        body.mobile,
        body.cloudId
    ]
    return dbPool.execute(sql, values)
}

const updateMerchant = (body) => {
    const id = body.id
    const updatedAt = moment().utc().format('YYYY-MM-DD hh:mm:ss')
    const sql = `UPDATE merchants SET name=?, address=?, mobile=?, cloud_id=?, updated_at=? WHERE id='${id}'`
    const values = [
        body.name,
        body.address,
        body.mobile,
        body.cloudId,
        updatedAt
    ]
    return dbPool.execute(sql, values)
}

module.exports = {
    getAllMerchants,
    insertMerchant,
    updateMerchant
}