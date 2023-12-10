const dbPool = require('../config/database');

const getIngredient = async (body) => {
    const branch_id = body.branch_id;
    const search = body.search;
    let sql;
    sql = `SELECT inventory_ingredients.*, ingredients.name as name, ingredient_units.name as unit, ingredient_categories.name as category 
        FROM inventory_ingredients
        LEFT JOIN ingredients ON ingredients.id = inventory_ingredients.ingredient_id
        LEFT JOIN ingredient_units ON ingredient_units.id = ingredients.unit_id
        LEFT JOIN ingredient_categories ON ingredient_categories.id = ingredients.ingredient_category_id 
        WHERE inventory_ingredients.branch_id = '${branch_id}' AND ingredients.name LIKE '%${search}%'
        ORDER BY name ASC
        LIMIT 10
    `
    const [data] = await dbPool.execute(sql)
    return data
    
}

module.exports = {
    getIngredient
}