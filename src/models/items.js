const dbPool = require('../config/database');

const getSku = (body) => {
    const sku = body.sku
    const sql = `SELECT item_variants.*, products.name as product, products.image as image FROM item_variants LEFT JOIN products ON products.id = item_variants.product_id WHERE item_variants.sku = '${sku}'`
    return dbPool.execute(sql)
}

const getItems = (body) => {
    const search = body.search
    const sql = `SELECT item_variants.*, products.name as product, products.image as image FROM item_variants LEFT JOIN products ON products.id = item_variants.product_id WHERE products.name LIKE '%${search}%' ORDER BY product ASC, id ASC LIMIT 20`
    return dbPool.execute(sql)
}

const deleteItem = async (id) => {
    let sql;
    sql = `DELETE FROM products WHERE id='${id}'`
    await dbPool.execute(sql)
    sql = `DELETE FROM item_variants WHERE product_id='${id}'`
    return dbPool.execute(sql)
}

module.exports = {
    getSku,
    getItems,
    deleteItem
}