const dbPool = require('../config/database');
const moment = require('moment');
const summary_ingredients = async () => {
    const date = moment().format('YYYY-MM-DD')
    let sql;
    sql = `SELECT * FROM summary_ingredients WHERE DATE(created_at)='${date}' LIMIT 1`
    const [summary] = await dbPool.execute(sql)
    if(summary.length == 0) {
        sql =   `SELECT * FROM branches`
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
                    beginning =summary[0].ending
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

module.exports = {
    summary_ingredients
}