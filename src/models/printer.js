const dbPool = require('../config/database');

const insertOrUpdate = async (body) => {
    let sql;
    sql = `SELECT * FROM printers WHERE branch_id = '${body.branch_id}'`
    const [data] = await dbPool.execute(sql)
    if(data.length == 0) {
        sql = `INSERT INTO printers (name, address, branch_id) 
                VALUES('${body.name}', '${body.address}', '${body.branch_id}') `
        return dbPool.execute(sql);
    } else {
        sql = `UPDATE printers SET name='${body.name}', address='${body.address}' where branch_id='${body.branch_id}'`
        return dbPool.execute(sql)
    }

}

const getPrinter = async (body) => {
    const sql = `SELECT name, address, branch_id FROM printers WHERE branch_id = '${body}'`
    return dbPool.execute(sql)
}

module.exports = {
    insertOrUpdate,
    getPrinter
}