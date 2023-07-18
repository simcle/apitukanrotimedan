const dbPool = require('../config/database');

const searchBrand = (search) => {
    const sql = `SELECT * FROM brands WHERE name LIKE '%${search}%' ORDER BY name ASC LIMIT 5`;
    return dbPool.execute(sql)
}

const insertBrand = async (body) => {
    let sql = `INSERT INTO brands (name) VALUES('${body.name}')`
    const [data] = await dbPool.execute(sql)
    sql = `SELECT * FROM brands WHERE id='${data.insertId}'`
    return dbPool.execute(sql)
}

module.exports = {
    searchBrand,
    insertBrand
}