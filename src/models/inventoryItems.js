const dbPool = require('../config/database');

const getItems = async (body) => {
    const branch_id = body.branch_id
    const search = body.search
    let sql = `SELECT inventory_items.*, item_variants.name as name, products.name as product FROM inventory_items
        LEFT JOIN item_variants ON inventory_items.item_id = item_variants.id
        LEFT JOIN products ON item_variants.product_id = products.id
        WHERE inventory_items.branch_id = '${branch_id}' AND products.name LIKE '%${search}%'
        LIMIT 10
    `
    return dbPool.execute(sql)
}

module.exports = {
    getItems
}