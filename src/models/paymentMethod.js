const dbPool = require('../config/database');


const getAllPaymentMethod = () => {
    sql = `SELECT * FROM payment_methods`
    return dbPool.execute(sql)
}

const insertPaymentMethod = async (body) => {
    let sql = `INSERT INTO payment_methods (
        name,
        type,
        provider
    ) VALUES (?, ?, ?)`
    let values = [
        body.name,
        body.type,
        body.provider
    ]
    await dbPool.execute(sql, values)
    sql = `SELECT * FROM payment_methods`
    return dbPool.execute(sql)
}

const updatePaymentMethod = async (body) => {
    let sql = `UPDATE payment_methods SET name=?, type=?, provider=?, status=? WHERE id=?`
    let values = [
        body.name,
        body.type,
        body.provider,
        body.status,
        body.id 
    ]
    await dbPool.execute(sql, values)
    sql = `SELECT * FROM payment_methods`
    return dbPool.execute(sql)
}
module.exports = {
    insertPaymentMethod,
    getAllPaymentMethod,
    updatePaymentMethod
}