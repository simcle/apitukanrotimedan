const dbPool = require('../config/database');

const getItems = (body) => {
    const search = body.search
    const sql = `SELECT item_variants.*, products.name as product, products.image as image FROM item_variants LEFT JOIN products ON products.id = item_variants.product_id WHERE products.name LIKE '%${search}%' ORDER BY product ASC, id ASC LIMIT 20`
    return dbPool.execute(sql)
}

module.exports = {
    getItems
}