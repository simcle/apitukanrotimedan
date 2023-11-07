const dbPool = require('../config/database');

const getItems = async (body) => {
    const search = body.search
    let sql; 
    sql = `SELECT * FROM products WHERE name LIKE '%${search}%' LIMIT 10`
    const [data] = await dbPool.execute(sql)
    for (let i = 0; i < data.length; i++) {
        const productId = data[i].id;
        data[i].item_variants = []
        sql = `SELECT item_variants.*, receipes.variant_id as variant_id 
        FROM item_variants 
        LEFT JOIN receipes ON receipes.variant_id = item_variants.id
        WHERE product_id=${productId}`
        const [variants] = await dbPool.execute(sql)
        data[i].item_variants = variants
    }
    return data
}

const getIngredients = async (body) => {
    const search = body.search
    let sql;
    sql = `SELECT ingredients.*, ingredient_units.name as unit_name FROM ingredients
    LEFT JOIN ingredient_units ON ingredient_units.id = ingredients.unit_id
    WHERE ingredients.name LIKE '%${search}%'
    LIMIT 10`
    const [data] = await dbPool.execute(sql)
    return data
}

const getAllReceipes = async (body) => {
    let currentPage = parseInt(body.page) || 1
    let perPage = body.perPage || 20
    let totalItems;
    let search = body.search
    let sql;
    sql = `SELECT COUNT(receipes.id) as count
    FROM receipes 
    LEFT JOIN products ON products.id = receipes.item_id
    WHERE products.name LIKE '%${search}%'`
    const [count]  = await dbPool.execute(sql)
    if(count[0].count) {
        totalItems = count[0].count
    } else {
        totalItems = 0
    } 
    sql = `SELECT receipes.*, products.name as item_name, item_variants.name as variant_name
    FROM receipes 
    LEFT JOIN products ON products.id = receipes.item_id
    LEFT JOIN item_variants ON item_variants.id = receipes.variant_id
    WHERE products.name LIKE '%${search}%'
    ORDER BY receipes.id DESC
    LIMIT ${perPage} OFFSET ${(currentPage -1) * perPage}`
    const [data] = await dbPool.execute(sql)
    for (let i=0; i < data.length; i++) {
        const receipeId = data[i].id
        sql = `SELECT receipe_ingredients.*, ingredients.name as ingredient_name, ingredients.unit_cost as unit_cost, ingredient_units.name as unit_name 
        FROM receipe_ingredients
        LEFT JOIN ingredients ON ingredients.id = receipe_ingredients.ingredient_id
        LEFT JOIN ingredient_units ON ingredient_units.id = ingredients.unit_id
        WHERE receipe_ingredients.receipe_id = '${receipeId}'`
        const [ingredients] = await dbPool.execute(sql);
        data[i].receipes = ingredients
    }
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

const insertReceipes = async (body) => {
    const receipes = body.receipes
    let sql;
    sql = `INSERT INTO receipes (
        item_id,
        variant_id
    ) VALUES (?, ?)`
    let values = [
        body.item_id,
        body.variant_id
    ]
    const [receipe] = await dbPool.execute(sql, values)
    const insertId = receipe.insertId
    for(let i = 0; i < receipes.length; i++) {
        const rc = receipes[i]
        sql = `INSERT INTO receipe_ingredients (
            receipe_id,
            ingredient_id,
            qty
        ) VALUES (?, ?, ?)`
        values = [
            insertId,
            rc.ingredient_id,
            rc.qty
        ]
        await dbPool.execute(sql, values)
    }

}

const updateReceipes = async (body) => {
    const receipeId = body.id
    const receipes = body.receipes
    const deletes = body.deletes
    let sql;
    for(let i = 0; i < receipes.length; i ++) {
        const receipe = receipes[i]
        sql = `SELECT * FROM receipe_ingredients WHERE id = '${receipe.id}'`
        const [data] = await dbPool.execute(sql)
        if(data.length > 0) {
            sql = `UPDATE receipe_ingredients SET qty = '${receipe.qty}' WHERE id = '${receipe.id}'`
            await dbPool.execute(sql);
        } else {
            sql = `INSERT INTO receipe_ingredients (
                receipe_id,
                ingredient_id,
                qty
            ) VALUES (?, ?, ?)`
            let values = [
                receipeId,
                receipe.ingredient_id,
                receipe.qty,
            ]
            await dbPool.execute(sql, values)
        }
    }
    for(let i = 0; i < deletes.length; i++) {
        const id = deletes[i].id
        sql = `DELETE FROM receipe_ingredients WHERE id = '${id}'`
        await dbPool.execute(sql);
    }
    return 'OK'
}

module.exports = {
    getItems,
    getIngredients,
    getAllReceipes,
    insertReceipes,
    updateReceipes
}