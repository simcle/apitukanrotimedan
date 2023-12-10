const dbPool = require('../config/database');
const moment = require('moment');
const summary_ingredients = async () => {
    const date = moment().format('YYYY-MM-DD')
    let sql;
    sql = `SELECT * FROM summary_ingredients WHERE DATE(created_at)='${date}' LIMIT 1`
    const [summary] = await dbPool.execute(sql)
    if(summary.length == 0) {
        sql = `SELECT * FROM branches`
        const [branches] = await dbPool.execute(sql)
        sql = `SELECT ingredients.*, ingredient_units.name as unit_name FROM ingredients
        LEFT JOIN ingredient_units ON ingredient_units.id = ingredients.unit_id`
        const [ingredients] = await dbPool.execute(sql)
        for (let i = 0; i < branches.length; i++) {
            const branch = branches[i]
            for(let b = 0; b < ingredients.length; b++) {
                const ingredient = ingredients[b]
                sql = `SELECT * FROM summary_ingredients WHERE branch_id='${branch.id}' AND ingredient_id='${ingredient.id}'  ORDER BY id DESC LIMIT 1`
                const [summary] = await dbPool.execute(sql)
                let beginning;
                if(summary[0]) {
                    beginning = summary[0].ending
                } else {
                    beginning = 0
                }
                sql = `INSERT INTO summary_ingredients (
                    branch_id,
                    ingredient_id,
                    ingredient_name,
                    beginning,
                    ending,
                    unit_name
                ) VALUES ('${branch.id}', '${ingredient.id}', '${ingredient.name}', '${beginning}', '${beginning}', '${ingredient.unit_name}')`
                try {
                    await dbPool.execute(sql)
                } catch (error) {
                    console.log(error)
                }
            }
        }
    }
}

const summary_items = async () => {
    const date = moment().format('YYYY-MM-DD')
    let sql;
    sql = `SELECT * FROM summary_items WHERE DATE(created_at)='${date}' LIMIT 1`   
    const [summary] = await dbPool.execute(sql)
    if(summary.length == 0) {
        sql =   `SELECT * FROM branches`
        const [branches] = await dbPool.execute(sql)
        for (let b = 0; b < branches.length; b++) {
            const branch = branches[b]
            sql = `SELECT inventory_items.*, item_variants.id as item_id, item_variants.sku as sku, item_variants.name as name, products.name as product FROM inventory_items 
                LEFT JOIN item_variants ON inventory_items.item_id = item_variants.id
                LEFT JOIN products ON item_variants.product_id = products.id 
                WHERE inventory_items.branch_id = '${branch.id}'
            `
            const [items] = await dbPool.execute(sql)
            for (let i = 0; i < items.length; i++) {
                const item = items[i]
                sql = `SELECT * FROM summary_items WHERE branch_id = '${branch.id}' AND item_id = '${item.item_id}'`
                const [summary] = await dbPool.execute(sql)
                let beginning;
                let item_name;
                if(item.name) {
                    item_name = `${item.product} - ${item.name}`
                } else {
                    item_name = `${item.product}`
                }
                if(summary[0]) {
                    beginning = summary[0].ending
                } else {
                    beginning = 0
                }
                sql = `INSERT INTO summary_items (
                    branch_id,
                    item_id,
                    item_sku,
                    item_name,
                    beginning,
                    ending
                ) VALUES ('${item.branch_id}', '${item.item_id}', '${item.sku}', '${item_name}', '${beginning}', '${beginning}')`
                await dbPool.execute(sql)
            }
        }
    }
}

module.exports = {
    summary_ingredients,
    summary_items
}