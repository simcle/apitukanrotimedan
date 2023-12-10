const fs = require('fs');
const dbPool = require('../config/database');
const getIngredientCategories = async () => {
    let sql = `SELECT * FROM ingredient_categories`
    return dbPool.execute(sql);
}

const getAllIngredients = async (body) => {
    let currentPage = parseInt(body.page) || 1
    let perPage = body.perPage || 20
    let totalItems;
    let search = body.search
    let filter = body.filter
    let sql;
    if(filter) {
        let categories = filter.join("','")
        sql = `SELECT COUNT(*) as count FROM ingredients WHERE name LIKE '%${search}%' AND ingredient_category_id IN ('${categories}')`
    } else {
        sql = `SELECT COUNT(*) as count FROM ingredients WHERE name LIKE '%${search}%'`
    }
    const [count]  = await dbPool.execute(sql)
    if(count[0].count) {
        totalItems = count[0].count
    } else {
        totalItems = 0
    } 
    if(filter) {
        let categories = filter.join("','")
        sql = `SELECT ingredients.*, ingredient_categories.name as category_name, ingredient_units.name as unit_name, SUM(inventory_ingredients.qty) as qty 
        FROM ingredients
        LEFT JOIN inventory_ingredients ON inventory_ingredients.ingredient_id = ingredients.id
        LEFT JOIN ingredient_categories ON ingredient_categories.id = ingredients.ingredient_category_id 
        LEFT JOIN ingredient_units ON ingredient_units.id = ingredients.unit_id 
        WHERE ingredients.name LIKE '%${search}%' AND ingredient_category_id IN ('${categories}') 
        ORDER BY id DESC
        LIMIT ${perPage} OFFSET ${(currentPage -1) * perPage}`
    } else {
        sql = `SELECT ingredients.*, ingredient_categories.name as category_name, ingredient_units.name as unit_name, inventory.qty as qty
        FROM ingredients
        LEFT JOIN (SELECT ingredient_id, SUM(qty) as qty FROM inventory_ingredients GROUP BY ingredient_id) as inventory ON inventory.ingredient_id = ingredients.id 
        LEFT JOIN ingredient_categories ON ingredient_categories.id = ingredients.ingredient_category_id 
        LEFT JOIN ingredient_units ON ingredient_units.id = ingredients.unit_id 
        WHERE ingredients.name LIKE '%${search}%'
        ORDER BY id DESC
        LIMIT ${perPage} OFFSET ${(currentPage -1) * perPage}`
    }
    const [data] = await dbPool.execute(sql)
    for(let i = 0; i < data.length; i++) {
        const ingredientId = data[i].id
        sql = `SELECT * FROM receipe_ingredients WHERE ingredient_id = '${ingredientId}' LIMIT 1`
        const [ready] = await dbPool.execute(sql)
        if(ready.length > 0) {
            data[i].used = true
        } else {
            data[i].used = false
        }
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
const insertIngredient = async (body) => {
    let sql = `INSERT INTO ingredients (
        name,
        ingredient_category_id,
        unit_id,
        unit_cost,
        image
    ) VALUES (?, ?, ?, ?, ?)`
    let values = [
        body.name,
        body.ingredient_category_id,
        body.unit_id,
        body.unit_cost,
        body.image
    ]
    const [ingredient] = await dbPool.execute(sql, values)
    const ingredientId = ingredient.insertId
    if(body.branch_id) {
        sql = `INSERT INTO inventory_ingredients (
            branch_id,
            ingredient_id,
            qty
        ) VALUES ('${body.branch_id}', '${ingredientId}', '0')`
        await dbPool.execute(sql)
    }
    sql = `SELECT * FROM branches`
    const [branches] = await dbPool.execute(sql)
    for(let i = 0; i < branches.length; i++) {
        const branchId = branches[i].id
        sql = `INSERT INTO summary_ingredients (
            branch_id,
            ingredient_id,
            ingredient_name,
            unit_name
        ) VALUES ('${branchId}', '${ingredientId}', '${body.name}', '${body.unit_name}')`
        await dbPool.execute(sql)
    }
    return 'OK'
}

const updateIngredient = async (body) => {
    let sql;
    if(body.image) {
        sql = `SELECT image FROM ingredients WHERE id = ${body.id}`
        const [data] = await dbPool.execute(sql)
        const filePath = data[0].image
        if(fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
        }
    }
    sql = `UPDATE ingredients SET name=?, ingredient_category_id=?, unit_id=?, unit_cost=?, image=? WHERE id=?`
    let values = [
        body.name,
        body.ingredient_category_id,
        body.unit_id,
        body.unit_cost,
        body.image,
        body.id
    ]
    await dbPool.execute(sql, values)
    sql = `UPDATE summary_ingredients SET ingredient_name='${body.name}', unit_name='${body.unit_name}' WHERE ingredient_id=${body.id}`
    await dbPool.execute(sql)
}

const deleteIngredient = async (id) => {
    let sql = `DELETE FROM ingredients WHERE id = '${id}'`
    await dbPool.execute(sql)
    return 'OK'
}

module.exports = {
    getIngredientCategories,
    insertIngredient,
    getAllIngredients,
    updateIngredient,
    deleteIngredient
}