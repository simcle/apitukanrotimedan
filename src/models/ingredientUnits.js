const dbPool = require('../config/database');

const searchCategory = (search) => {
    const sql = `SELECT * FROM ingredient_units WHERE name LIKE '%${search}%' ORDER BY name ASC LIMIT 5`;
    return dbPool.execute(sql)
}

const insertCategory = async (body) => {
    let sql = `INSERT INTO ingredient_units (name) VALUES('${body.name}')`
    const [data] = await dbPool.execute(sql)
    sql = `SELECT * FROM ingredient_units WHERE id='${data.insertId}'`
    return dbPool.execute(sql)
}

const getAllCategory = () => {
    const sql =  `SELECT * FROM ingredient_units`
    return dbPool.execute(sql)
}

module.exports = {
    searchCategory,
    insertCategory,
    getAllCategory
}