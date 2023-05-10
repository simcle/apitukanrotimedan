const dbPool = require('../config/database');
const moment = require('moment')

const getAllBranch = () => {
    const sql = `SELECT * FROM branches ORDER BY name ASC`
    return dbPool.execute(sql)
}

const insertBranch = (body) => {
    const sql = `INSERT INTO branches (name, address, mobile, cloud_id) 
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

const updateBranch = (body) => {
    const id = body.id
    const updatedAt = moment().utc().format('YYYY-MM-DD hh:mm:ss')
    const sql = `UPDATE branches SET name=?, address=?, mobile=?, cloud_id=?, updated_at=? WHERE id='${id}'`
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
    getAllBranch,
    insertBranch,
    updateBranch
}