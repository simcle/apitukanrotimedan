const dbPool = require('../config/database');

const searchCategory = (search) => {
    const sql = `SELECT * FROM categories WHERE name LIKE '%${search}%' ORDER BY name ASC LIMIT 5`;
    return dbPool.execute(sql)
}

const insertCategory = async (body) => {
    let sql = `INSERT INTO categories (name) VALUES('${body.name}')`
    const [data] = await dbPool.execute(sql)
    sql = `SELECT * FROM categories WHERE id='${data.insertId}'`
    return dbPool.execute(sql)
}

const getAllCategory = () => {
    const sql =  `SELECT * FROM categories`
    return dbPool.execute(sql)
}

module.exports = {
    searchCategory,
    insertCategory,
    getAllCategory
}