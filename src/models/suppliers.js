const dbPool = require('../config/database');


const getAllSupplier = async (body) => {
    let currentPage = parseInt(body.page) || 1
    let perPage = body.perPage || 20
    let totalItems;
    let search = body.search
    let sql;
    sql = `SELECT COUNT(*) as count FROM suppliers WHERE name LIKE '%${search}%'`
    const [count]  = await dbPool.execute(sql)
    if(count[0].count) {
        totalItems = count[0].count
    } else {
        totalItems = 0
    } 
    sql = `SELECT * FROM suppliers WHERE name LIKE '%${search}%' 
    ORDER BY id DESC
    LIMIT ${perPage} OFFSET ${(currentPage -1) * perPage}`
    const [data] = await dbPool.execute(sql)
    const last_page = Math.ceil(totalItems / perPage)
    return {
        data: data,
        pages: {
            current_page: currentPage,
            last_page: last_page,
            totalItems: totalItems
        }
    }
}
const insertSupplier = async (body) => {
    let sql = `INSERT INTO suppliers (
        name,
        mobile,
        email,
        address,
        city,
        province,
        zip
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`
    let values = [
        body.name,
        body.mobile,
        body.email,
        body.address,
        body.city,
        body.province,
        body.zip
    ]
    await dbPool.execute(sql, values)
    return 'OK'
}

const updateSupplier = async (body) => {
    let sql = `UPDATE suppliers SET 
    name=?,
    mobile=?,
    email=?,
    address=?,
    city=?,
    province=?,
    zip=?
    WHERE id=?`
    let values = [
        body.name,
        body.mobile,
        body.email,
        body.address,
        body.city,
        body.province,
        body.zip,
        body.id
    ]
    await dbPool.execute(sql, values)
    return 'OK'
}
module.exports = {
    getAllSupplier,
    insertSupplier,
    updateSupplier
}