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
        sql = `SELECT COUNT(*) as count FROM ingredients WHERE name LIKE '%${search}%' AND ingredient_category_id IN (${filter})`
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
        sql = `SELECT ingredients.*, ingredient_categories.name as category_name, ingredient_units.name as unit_name 
        FROM ingredients
        LEFT JOIN ingredient_categories ON ingredient_categories.id = ingredients.ingredient_category_id 
        LEFT JOIN ingredient_units ON ingredient_units.id = ingredients.unit_id 
        WHERE ingredients.name LIKE '%${search}%' AND ingredient_category_id IN (${filter}) 
        ORDER BY id DESC
        LIMIT ${perPage} OFFSET ${(currentPage -1) * perPage}`
    } else {
        sql = `SELECT ingredients.*, ingredient_categories.name as category_name, ingredient_units.name as unit_name
        FROM ingredients
        LEFT JOIN ingredient_categories ON ingredient_categories.id = ingredients.ingredient_category_id 
        LEFT JOIN ingredient_units ON ingredient_units.id = ingredients.unit_id 
        WHERE ingredients.name LIKE '%${search}%'
        ORDER BY id DESC
        LIMIT ${perPage} OFFSET ${(currentPage -1) * perPage}`
    }
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
    return await dbPool.execute(sql, values)
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
}

module.exports = {
    getIngredientCategories,
    insertIngredient,
    getAllIngredients,
    updateIngredient
}