const dbPool = require('../config/database');
const moment = require('moment');
const summary = async (body , type) => {
    const date = moment().format('YYYY-MM-DD')
    const branch_id = body.branch_id
    const ingredient_id = body.ingredient_id
    const qty = body.qty
    const adjustment = body.adjustment
    let ending
    let sql;
    sql = `SELECT * FROM summary_ingredients WHERE branch_id='${branch_id}' AND ingredient_id='${ingredient_id}' AND DATE(created_at)='${date}'`
    const [data] = await dbPool.execute(sql)
    switch (type) {
        case 'Purchasing': 
            let purchase = parseFloat(data[0].purchase) + parseFloat(qty)
            ending = parseFloat(data[0].ending) + parseFloat(qty)
            sql = `UPDATE summary_ingredients SET purchase='${purchase}', ending=${ending} WHERE branch_id='${branch_id}' AND ingredient_id='${ingredient_id}' AND DATE(created_at)='${date}'`
            await dbPool.execute(sql);
            await updateStock(branch_id, ingredient_id, ending)
            break;
        case 'Adjustment':
            let adj = parseFloat(data[0].adjustment) + parseFloat(adjustment)
            ending = qty
            sql = `UPDATE summary_ingredients SET adjustment='${adj}', ending='${ending}' WHERE branch_id='${branch_id}' AND ingredient_id='${ingredient_id}' AND DATE(created_at)='${date}'`
            await dbPool.execute(sql)
            await updateStock(branch_id, ingredient_id, ending)
            break;
        case 'Transfer':
            let transfer = parseFloat(data[0].transfer) + parseFloat(qty)
            ending = parseFloat(data[0].ending) + parseFloat(qty)
            sql = `UPDATE summary_ingredients SET transfer='${transfer}', ending='${ending}' WHERE branch_id='${branch_id}' AND ingredient_id='${ingredient_id}' AND DATE(created_at)='${date}'`
            await dbPool.execute(sql)
            await updateStock(branch_id, ingredient_id, ending)

            sql = `SELECT * FROM summary_ingredients WHERE branch_id='8' AND ingredient_id='${ingredient_id}' AND DATE(created_at)='${date}'`
            const [old] = await dbPool.execute(sql)
            transfer = parseFloat(old[0].transfer) - parseFloat(qty)
            ending = parseFloat(old[0].ending) - parseFloat(qty)
            sql = `UPDATE summary_ingredients SET transfer='${transfer}', ending='${ending}' WHERE branch_id='8' AND ingredient_id='${ingredient_id}' AND DATE(created_at)='${date}'`
            await dbPool.execute(sql)
            await updateStock(8, ingredient_id, ending)
            break;
        case 'Usage': 
            let usage = parseFloat(data[0].usages) + parseFloat(qty)
            ending = parseFloat(data[0].ending) - parseFloat(qty)
            sql = `UPDATE summary_ingredients SET usages='${usage}', ending='${ending}' WHERE branch_id='${branch_id}' AND ingredient_id = '${ingredient_id}' AND DATE(created_at) ='${date}'`
            await dbPool.execute(sql)
            await updateStock(branch_id, ingredient_id, ending)
            break;
    }  
    return
}

const updateStock = async (branch_id, ingredient_id, qty) => {
    let sql = `SELECT * FROM inventory_ingredients WHERE branch_id='${branch_id}' AND ingredient_id='${ingredient_id}'`
    const [ready] = await dbPool.execute(sql)
    if(ready.length > 0) {
        sql = `UPDATE inventory_ingredients SET qty='${qty}' WHERE branch_id='${branch_id}' AND ingredient_id='${ingredient_id}'`
        await dbPool.execute(sql)
    } else {
        sql = `INSERT inventory_ingredients (
            branch_id,
            ingredient_id,
            qty
        ) VALUES ('${branch_id}', '${ingredient_id}', '${qty}')`
        await dbPool.execute(sql)
    }
}
module.exports = summary