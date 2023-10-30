const dbPool = require('../config/database');

const getSku = (body) => {
    const sku = body.query.sku
    const branchId = body.user.branch_id
    const sql = `SELECT item_variants.*, products.name as product, products.image as image, item_prices.price as price, item_prices.branch_id as branch_id 
    FROM item_variants 
    LEFT JOIN products ON products.id = item_variants.product_id
    LEFT JOIN item_prices ON item_prices.variant_id = item_variants.id
    WHERE item_variants.sku = '${sku}'
    AND branch_id = '${branchId}'`
    return dbPool.execute(sql)
}

const getItems = (body) => {
    const search = body.search
    const branchId = body.branch_id
    const sql = `SELECT item_variants.*, products.name as product, products.image as image, item_prices.price as price, item_prices.branch_id as branch_id
    FROM item_variants 
    LEFT JOIN products ON products.id = item_variants.product_id 
    LEFT JOIN item_prices ON item_prices.variant_id = item_variants.id
    WHERE products.name LIKE '%${search}%' 
    AND branch_id = '${branchId}'
    ORDER BY product ASC, id ASC LIMIT 20`
    return dbPool.execute(sql)
}

const deleteItem = async (id) => {
    let sql;
    sql = `SELECT id FROM item_variants WHERE product_id='${id}'`
    const [variantId] = await dbPool.execute(sql);
    sql = `DELETE FROM products WHERE id='${id}'`
    await dbPool.execute(sql)
    sql = `DELETE FROM item_variants WHERE product_id='${id}'`
    await dbPool.execute(sql)
    for ( let i = 0; i < variantId.length; i++) {
        const id = variantId[i].id
        sql = `DELETE FROM item_prices WHERE variant_id='${id}'`
        await dbPool.execute(sql);
    }
}

module.exports = {
    getSku,
    getItems,
    deleteItem
}