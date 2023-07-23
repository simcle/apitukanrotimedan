
const dbPool = require('../config/database');


const getAllCustomer = async (body) => {
    const branch_id = body.branch_id
    const search = body.search
    let sql =`SELECT * FROM customers WHERE branch_id=${branch_id} AND name LIKE '%${search}%' ORDER BY name ASC LIMIT 10`
    return dbPool.execute(sql)
}
const insertCustomer = async (body) => {
    let sql = `INSERT INTO customers (
        code,
        name,
        telepon,
        alamat,
        catatan,
        branch_id,
        user_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`
    let values = [
        body.code,
        body.name,
        body.telepon,
        body.alamat,
        body.catatan,
        body.branch_id,
        body.user_id
    ]
    const [custoemr] = await dbPool.execute(sql, values);
    const insertId = custoemr.insertId
    sql =`SELECT * FROM customers WHERE id = ${insertId}`
    return dbPool.execute(sql)
}
const updateCustomer = async (body) => {
    let sql = `UPDATE customers SET name=?, telepon=?, alamat=?, catatan=? WHERE id=?`
    let values = [
        body.name,
        body.telepon,
        body.alamat,
        body.catatan,
        body.id
    ]
    return dbPool.execute(sql, values)
}
module.exports = {
    getAllCustomer,
    insertCustomer,
    updateCustomer
}